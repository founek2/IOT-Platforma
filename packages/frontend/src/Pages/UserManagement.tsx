import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { IUser } from 'common/lib/models/interface/userInterface';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import FullScreenDialog from 'framework-ui/lib/Components/FullScreenDialog';
import EnchancedTable from 'framework-ui/lib/Components/Table';
import { getAllowedGroups, isGroupAllowed } from 'framework-ui/lib/privileges';
import { usersActions } from 'framework-ui/lib/redux/actions/application/users';
import arrToString from 'framework-ui/lib/utils/arrToString';
import { isUrlHash } from 'framework-ui/lib/utils/getters';
import { History } from 'history';
import { isEmpty } from 'ramda';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getGroups, getQueryID, getUsers } from '../utils/getters';
import EditUser from './userManagement/EditUser';

function convertGroupIDsToName(groups: { group: string; text: string }[]) {
    return function (arr: string[]) {
        return arrToString(
            arr.map((id) => {
                if (isEmpty(groups)) return id;
                const group = groups.find((obj) => obj.group === id);
                if (!group) return id;
                return group.text;
            })
        );
    };
}
const userProps = (groups: { group: string; text: string }[]) => [
    { path: 'info.userName', label: 'Uživatelské jméno' },
    { path: 'info.firstName', label: 'Jméno' },
    { path: 'info.lastName', label: 'Přijmení' },
    { path: 'info.email', label: 'Email' },
    { path: 'info.phoneNumber', label: 'Telefon' },
    { path: 'groups', label: 'Uživ. skupiny', convertor: convertGroupIDsToName(groups) },
    { path: 'createdAt', label: 'Vytvořen', convertor: (val: any) => new Date(val).toLocaleDateString() },
];

const useStyles = makeStyles((theme) => ({
    errorColor: {
        color: (theme as any).errorColor,
    },
    cardContent: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

interface UserManagementProps {
    history: History;
}
function UserManagement({ history }: UserManagementProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const groups = useAppSelector(getGroups);
    const openEditDialog = useAppSelector(isUrlHash('#editUser'));
    const userId = useAppSelector(getQueryID);
    const users = useAppSelector(getUsers) as IUser[];
    const userToEdit = users.find((u) => u._id === userId);

    useEffect(() => {
        dispatch(usersActions.fetchAll());
    }, [dispatch]);
    const isAdmin = isGroupAllowed('admin', groups);

    return (
        <div>
            <Card>
                <div className={classes.cardContent}>
                    <FieldConnector
                        deepPath="USER_MANAGEMENT.selected"
                        component={({ onChange, value }) => (
                            <EnchancedTable
                                dataProps={userProps(getAllowedGroups(groups)) as unknown as any}
                                data={users}
                                toolbarHead="Správa uživatelů"
                                onDelete={() => dispatch(usersActions.deleteUsers())}
                                orderBy="userName"
                                // enableCreation={isAdmin}
                                enableEdit={isAdmin}
                                onEdit={(id: string) => history.push({ hash: 'editUser', search: '?id=' + id })}
                                rowsPerPage={10}
                                onChange={onChange}
                                value={value}
                            />
                        )}
                    />
                </div>
            </Card>
            <FullScreenDialog
                open={Boolean(openEditDialog && userToEdit)}
                onClose={() => history.push({ hash: '', search: '' })}
                heading="Editace uživatele"
            >
                {userToEdit && (
                    <EditUser
                        onButtonClick={async () => {
                            const result = await dispatch(usersActions.updateUser(userToEdit._id));
                            if (result) history.push({ hash: '', search: '' });
                        }}
                        user={userToEdit}
                    />
                )}
            </FullScreenDialog>
        </div>
    );
}

export default UserManagement;
