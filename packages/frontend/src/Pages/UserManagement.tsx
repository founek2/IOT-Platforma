import { makeStyles } from '@material-ui/core/styles';
import { IUser } from 'common/src/models/interface/userInterface';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import FullScreenDialog from 'framework-ui/src/Components/FullScreenDialog';
import EnchancedTable from 'framework-ui/src/Components/Table';
import { AllowedGroup, getAllowedGroups } from 'framework-ui/src/privileges';
import arrToString from 'framework-ui/src/utils/arrToString';
import { isUrlHash } from 'framework-ui/src/utils/getters';
import { isEmpty } from 'ramda';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { usersActions } from '../store/actions/application/users';
import { getGroups, getQueryID, getUsers } from '../utils/getters';
import EditUser from './userManagement/EditUser';

function convertGroupIDsToName(groups: AllowedGroup[]) {
    return function (arr: string[]) {
        return arrToString(
            arr.map((id) => {
                if (isEmpty(groups)) return id;
                const group = groups.find((obj) => obj.name === id);
                if (!group) return id;
                return group.text;
            })
        );
    };
}
const userProps = (groups: AllowedGroup[]) => [
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

function UserManagement() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const groups = useAppSelector(getGroups);
    const openEditDialog = useAppSelector(isUrlHash('#editUser'));
    const userId = useAppSelector(getQueryID);
    const users = useAppSelector(getUsers) as IUser[];
    const navigate = useNavigate();
    const userToEdit = users.find((u) => u._id === userId);

    useEffect(() => {
        dispatch(usersActions.fetchAll());
    }, [dispatch]);
    const isAdmin = groups.includes('admin');

    return (
        <div>
            <div className={classes.cardContent}>
                <FieldConnector
                    deepPath="USER_MANAGEMENT.selected"
                    component={({ onChange, value }) => (
                        <EnchancedTable
                            dataProps={userProps(getAllowedGroups(groups))}
                            data={users as unknown as (IUser & { _id: string })[]}
                            toolbarHead="Správa uživatelů"
                            onDelete={() => dispatch(usersActions.deleteUsers())}
                            orderBy="info.userName"
                            // enableCreation={isAdmin}
                            enableEdit={isAdmin}
                            onEdit={(id: string) => navigate({ hash: 'editUser', search: '?id=' + id })}
                            rowsPerPage={10}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
            </div>
            <FullScreenDialog
                open={Boolean(openEditDialog && userToEdit)}
                onClose={() => navigate({ hash: '', search: '' })}
                heading="Editace uživatele"
            >
                {userToEdit && (
                    <EditUser
                        onButtonClick={async () => {
                            const result = await dispatch(usersActions.updateUser(userToEdit._id));
                            if (result) navigate({ hash: '', search: '' });
                        }}
                        user={userToEdit}
                    />
                )}
            </FullScreenDialog>
        </div>
    );
}

export default UserManagement;
