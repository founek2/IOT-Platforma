import React, { useState } from "react";
import { logger } from 'common/src/logger';
import { useEffect } from 'react';
import { Dialog } from '../components/Dialog';
import EditUserForm from '../components/EditUserForm';
import { User } from '../endpoints/signIn';
import { EditUserFormData, useUpdateUserMutation, useUsersQuery } from '../endpoints/users';
import { useForm } from '../hooks/useForm';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { getCurrentUser } from "../selectors/getters";

export default function EditUserDialog() {
    const [selectedUser, setSelectedUser] = useState<User>()
    const [searchParams] = useSearchParams();
    const currentUser = useAppSelector(getCurrentUser)
    const { data: users } = useUsersQuery(undefined);
    const navigate = useNavigate()
    const editUserParam: "current" | string | undefined = searchParams.get("editUser") || undefined

    const { validateForm, resetForm, setFormData } = useForm<EditUserFormData>('EDIT_USER');
    const [updateUserMutation, { isLoading }] = useUpdateUserMutation();


    useEffect(() => {
        if (editUserParam === "current") {
            setSelectedUser(currentUser)
        } else if (editUserParam) {
            const user = users?.find(user => user._id === editUserParam)
            setSelectedUser(user)
        } else setSelectedUser(undefined)
    }, [editUserParam])

    useEffect(() => {
        if (selectedUser)
            setFormData({
                info: {
                    userName: selectedUser.info.userName,
                    email: selectedUser.info.email,
                    firstName: selectedUser.info.firstName,
                    lastName: selectedUser.info.lastName,
                },
                groups: selectedUser.groups,
            });

        return () => resetForm();
    }, [selectedUser, resetForm]);

    function onClose() {
        navigate({ search: "" }, { replace: true })
    }

    async function handleEdit() {
        const result = validateForm();
        if (!result.valid || !selectedUser) return;

        updateUserMutation({ userId: selectedUser._id, data: result.data })
            .unwrap()
            .then(onClose)
            .catch((err) => { logger.error(err) });
    }

    return <Dialog
        open={Boolean(selectedUser)}
        onClose={onClose}
        onAgree={handleEdit}
        agreeText="Uložit"
        disabled={isLoading}
    >
        <EditUserForm formName="EDIT_USER" editGroups />
    </Dialog>


}
