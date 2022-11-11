import { Card, CardContent, CircularProgress, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataList from '../components/DataList';
import { Dialog } from '../components/Dialog';
import EditUserForm from '../components/EditUserForm';
import { User } from '../endpoints/signIn';
import { EditUserFormData, RegisterUserForm, useUpdateUserMutation, useUsersQuery } from '../endpoints/users';
import { useAppDispatch } from '../hooks';
import { useForm } from '../hooks/useForm';
import { formsDataActions } from '../store/slices/formDataActions';

function extractHumanText(user: User) {
    let text = user.info.userName;

    if (user.groups.some((group) => group === 'admin' || group === 'root')) text += '*';

    text += ' (' + user.info.email;

    if (user.info.firstName) text += ` ${user.info.firstName}`;

    if (user.info.lastName) text += ` ${user.info.lastName}`;

    return text + ')';
}

export default function UserManagement() {
    const { isLoading, data } = useUsersQuery(undefined);
    const [selectedUser, setSelectedUser] = useState<User>();
    const { validateForm, resetForm, setFormData } = useForm<EditUserFormData>('EDIT_USER');
    const [updateUserMutation] = useUpdateUserMutation();

    useEffect(() => {
        if (!selectedUser) resetForm();
        else
            setFormData({
                info: {
                    userName: selectedUser.info.userName,
                    email: selectedUser.info.email,
                    firstName: selectedUser.info.firstName,
                    lastName: selectedUser.info.lastName,
                },
                groups: selectedUser.groups,
            });
    }, [selectedUser]);

    async function handleEdit() {
        const result = validateForm();
        if (!result.valid || !selectedUser) return;

        updateUserMutation({ userId: selectedUser._id, data: result.data })
            .unwrap()
            .then(() => setSelectedUser(undefined))
            .catch(() => {});
    }

    return isLoading ? (
        <CircularProgress />
    ) : (
        <>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={7} lg={6} xl={3}>
                    <Card sx={{ padding: 4 }}>
                        <DataList data={data || []} getHumanText={extractHumanText} onClick={setSelectedUser} />
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={Boolean(selectedUser)}
                onClose={() => setSelectedUser(undefined)}
                onAgree={handleEdit}
                agreeText="Uložit"
            >
                <EditUserForm formName="EDIT_USER" editGroups />
            </Dialog>
        </>
    );
}
