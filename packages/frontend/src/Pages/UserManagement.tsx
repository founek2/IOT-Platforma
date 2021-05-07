import React, { Component, useEffect, useState } from 'react';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { formsDataActions } from 'framework-ui/lib/redux/actions';
import * as usersActions from 'framework-ui/lib/redux/actions/application/users';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getGroups, getUsers, isUrlHash } from 'framework-ui/lib/utils/getters';
import EnchancedTable from 'framework-ui/lib/Components/Table';
import FullScreenDialog from 'framework-ui/lib/Components/FullScreenDialog';
import { merge, pick, isEmpty } from 'ramda';
import arrToString from 'framework-ui/lib/utils/arrToString';
import { getAllowedGroups } from 'framework-ui/lib/privileges';
import { isGroupAllowed } from 'framework-ui/lib/privileges';
import EditUser from './userManagement/EditUser';

import { getQueryID } from '../utils/getters';
import { IState } from '../types';
import { IUser } from 'common/lib/models/interface/userInterface';
import { History } from 'history';

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
    fetchAllUsers: any;
    groups: string[];
    users: IUser[];
    history: History;
    deleteUsers: any;
}
function UserManagement({ fetchAllUsers, groups, users, history, deleteUsers }: UserManagementProps) {
    const classes = useStyles();
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setEditCreate] = useState(false);
    const isAdmin = isGroupAllowed('admin', groups);

    return (
        <div>
            <Card>
                <div className={classes.cardContent}>
                    <FieldConnector
                        deepPath="USER_MANAGEMENT.selected"
                        component={({ onChange, value }) => (
                            <EnchancedTable
                                dataProps={(userProps(getAllowedGroups(groups)) as unknown) as any}
                                data={users}
                                toolbarHead="Správa uživatelů"
                                onDelete={deleteUsers}
                                orderBy="userName"
                                // enableCreation={isAdmin}
                                onAdd={() => setOpenCreate(true)}
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
        </div>
    );
}

const _mapStateToProps = (state: IState) => {
    return {
        groups: getGroups(state) as IUser['groups'],
        users: getUsers(state),
        openEditDialog: isUrlHash('#editUser')(state),
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            fetchAllUsers: usersActions.fetchAll,
            deleteUsers: usersActions.deleteUsers,
            createUser: usersActions.create,
            fillUserForm: formsDataActions.fillForm('USER'),
            resetUserForm: formsDataActions.resetForm('USER'),
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(UserManagement);
