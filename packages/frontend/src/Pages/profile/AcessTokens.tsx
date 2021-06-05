import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from '../../utils/date-fns';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import EnchancedTable from 'framework-ui/lib/Components/Table';
import { useManagementStyles } from 'frontend/src/hooks/useManagementStyles';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'frontend/src/types';
import { IUser, IAccessToken } from 'common/lib/models/interface/userInterface';
import { assoc, prop } from 'ramda';
import { IconButton, CardActions, Button, useMediaQuery, useTheme } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from 'framework-ui/lib/Components/Dialog';
import { useHistory } from 'react-router';
import { isUrlHash } from 'framework-ui/lib/utils/getters';
import EditAccessToken from './accessTokens/EditAccessToken';
import {
    createAccessToken,
    updateAccessToken,
    deleteAccessToken,
} from 'frontend/src/store/actions/application/accessTokens';
import { getQueryID } from 'frontend/src/utils/getters';
import { TokenPermissions } from 'frontend/src/constants';

const useStyles = makeStyles((theme) => ({
    header: {
        textAlign: 'center',
    },
}));

function Security() {
    const classes = useStyles();
    const classesTab = useManagementStyles();
    const user = useSelector<IState, IUser | undefined>((state) => state.application.user);
    const selectedId = useSelector<IState, string | undefined>(getQueryID);
    const openAddDialog = useSelector<IState, boolean>(isUrlHash('#addToken'));
    const openEditDialog = useSelector<IState, boolean>(isUrlHash('#editToken'));
    const history = useHistory();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('xs'));
    const dispatch = useDispatch();

    const accessTokens = useSelector<IState, IState['accessTokens']>((state) => state.accessTokens);
    const selectedToken = accessTokens.data.find((t) => t._id === selectedId);

    function deleteTokens(tokenIDs: Array<IAccessToken['token']>) {
        console.log('delete tokens...', tokenIDs);
        tokenIDs.forEach((id) => dispatch(deleteAccessToken(id, user?._id)));
    }
    console.log('sel token', selectedToken);
    function createToken() {
        return dispatch(createAccessToken(user?._id));
    }

    function editToken() {
        return dispatch(updateAccessToken(selectedId, user?._id));
    }

    return (
        <>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <Card>
                        {/* <CardHeader title="" className={classes.header} /> */}
                        <CardContent>
                            <FieldConnector
                                deepPath="DISCOVERY_DEVICES.selected"
                                component={({ onChange, value }) => (
                                    <EnchancedTable
                                        toolbarHead="Přístupové tokeny"
                                        customClasses={{
                                            tableWrapper: classesTab.tableWrapper,
                                            toolbar: classesTab.toolbar,
                                            pagination: classesTab.pagination,
                                        }}
                                        rowsPerPageOptions={[5, 10, 25]}
                                        // @ts-ignore
                                        dataProps={[
                                            { path: 'name', label: 'Název' },
                                            {
                                                path: 'permissions',
                                                label: 'Oprávnění',
                                                convertor: (val: Array<any>) =>
                                                    TokenPermissions.find((el) => el.value.toString() === String(val))
                                                        ?.label,
                                            },
                                            { path: 'token', label: 'Token' },
                                            {
                                                path: 'createdAt',
                                                label: 'Vytvořeno',
                                                convertor: (date: string) => new Date(date).toLocaleDateString(),
                                            },
                                            {
                                                path: 'validTo',
                                                label: 'Platnost',
                                                convertor: (date: string) =>
                                                    date ? new Date(date).toLocaleDateString() : '',
                                            },
                                        ]}
                                        data={accessTokens.data.map((device: any) =>
                                            assoc('id', prop('_id', device), device)
                                        )}
                                        onDelete={deleteTokens}
                                        orderBy="Název"
                                        onAdd={() => history.push({ hash: '#addToken' })}
                                        enableCreation
                                        enableEdit
                                        customEditButton={(id: string, item: IAccessToken) => (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    history.push({ hash: '#editToken', search: '?id=' + id })
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                        onChange={onChange}
                                        value={value}
                                    />
                                )}
                            />
                        </CardContent>
                        {/* <CardActions>
                        <Button color="primary" variant="contained">
                            Přidat
                        </Button>
                    </CardActions> */}
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={openAddDialog}
                title="Vytvoření tokenu"
                cancelText="Zrušit"
                agreeText="Uložit"
                onAgree={async () => {
                    if (await createToken()) history.push({ hash: '' });
                }}
                onClose={() => history.push({ hash: '' })}
                fullScreen={isSmall}
                content={<EditAccessToken formName="ADD_ACCESS_TOKEN" />}
            />
            <Dialog
                open={openEditDialog}
                title="Editace tokenu"
                cancelText="Zrušit"
                agreeText="Uložit"
                onAgree={() => {
                    editToken();
                    history.push({ hash: '', search: '' });
                }}
                onClose={() => history.push({ hash: '', search: '' })}
                fullScreen={isSmall}
                content={<EditAccessToken formName="EDIT_ACCESS_TOKEN" accessToken={selectedToken} />}
            />
        </>
    );
}

export default Security;
