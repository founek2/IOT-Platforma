import { IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { IAccessToken, IUser } from 'common/lib/models/interface/userInterface';
import Dialog from 'framework-ui/lib/Components/Dialog';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import EnchancedTable from 'framework-ui/lib/Components/Table';
import { isUrlHash } from 'framework-ui/lib/utils/getters';
import { TokenPermissions } from 'frontend/src/constants';
import { useManagementStyles } from 'frontend/src/hooks/useManagementStyles';
import { getQueryID } from 'frontend/src/utils/getters';
import { assoc, prop } from 'ramda';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import EditAccessToken from './accessTokens/EditAccessToken';
import { accessTokensActions } from 'frontend/src/store/actions/accessTokens';
import { RootState } from 'frontend/src/store/store';

function Security() {
    const classesTab = useManagementStyles();
    const user = useSelector<RootState, IUser | null>((state) => state.application.user);
    const selectedId = useSelector<RootState, string | undefined>(getQueryID);
    const openAddDialog = useSelector<RootState, boolean>(isUrlHash('#addToken'));
    const openEditDialog = useSelector<RootState, boolean>(isUrlHash('#editToken'));
    const history = useHistory();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('xs'));
    const dispatch = useDispatch();

    const accessTokens = useSelector<RootState, RootState['accessTokens']>((state) => state.accessTokens);
    const selectedToken = accessTokens.data.find((t) => t._id === selectedId);

    function deleteTokens(tokenIDs: Array<IAccessToken['token']>) {
        tokenIDs.forEach((id) => dispatch(accessTokensActions.delete(id, user?._id)));
    }

    function createToken() {
        return dispatch(accessTokensActions.create(user?._id));
    }

    function editToken() {
        return dispatch(accessTokensActions.updateToken(selectedId, user?._id));
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
