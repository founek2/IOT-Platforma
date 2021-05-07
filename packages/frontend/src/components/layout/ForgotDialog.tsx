import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Loader from 'framework-ui/lib/Components/Loader';
import { login, fetchAuthType } from 'framework-ui/lib/redux/actions/application/user';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { getQueryField } from '../../utils/getters';
import { AuthTypes } from 'common/lib/constants';
import * as deviceActions from '../../store/actions/application/devices';
import { grey } from '@material-ui/core/colors';
import * as userActions from 'frontend/src/store/actions/application/user';
import { IState } from 'frontend/src/types';
import { formsDataActions } from 'framework-ui/lib/redux/actions';

const useClasses = makeStyles((theme) => ({
    loginTitle: {
        margin: '0 auto',
        paddingBottom: 20,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 0,
        },
    },
    loginActions: {
        margin: 'auto',
        justifyContent: 'center',
    },
    content: {
        position: 'relative',
        width: 400,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        overflowY: 'visible',

        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: 0,
            marginRight: 0,
        },
    },
    loginFooter: {
        marginTop: 10,
        textAlign: 'center',
        paddingBottom: theme.spacing(2),
        overflowY: 'visible',
    },
    registerButton: {
        cursor: 'pointer',
        color: grey[500],
    },
}));

interface LoginDialogProps {
    token?: string;
    open: boolean;
    onClose: any;
    forgotAction: any;
    setFormFieldAction: any;
}
function ForgotDialog({ open, onClose, forgotAction, token, setFormFieldAction }: LoginDialogProps) {
    const classes = useClasses();
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (token) setFormFieldAction('FORGOT_PASSWORD.token', token);
    }, [token]);

    const forgotHandler = async () => {
        setPending(true);
        await forgotAction('FORGOT');
        setPending(false);
    };

    const passwordHandler = async () => {
        setPending(true);
        await forgotAction('FORGOT_PASSWORD');
        setPending(false);
    };

    const actionHandler = token ? passwordHandler : forgotHandler;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
            <DialogTitle id="form-dialog-title" className={classes.loginTitle}>
                Zapomenuté heslo
            </DialogTitle>
            <DialogContent className={classes.content}>
                <Grid container justify="center" spacing={2}>
                    {token ? (
                        <Grid item md={10} xs={12}>
                            <FieldConnector
                                deepPath="FORGOT_PASSWORD.password"
                                autoFocus
                                onEnter={actionHandler}
                                component="PasswordField"
                                fieldProps={{
                                    fullWidth: true,
                                }}
                            />
                        </Grid>
                    ) : (
                        <Grid item md={10} xs={12}>
                            <FieldConnector
                                deepPath="FORGOT.email"
                                autoFocus
                                onEnter={actionHandler}
                                fieldProps={{
                                    fullWidth: true,
                                }}
                            />
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions className={classes.loginActions}>
                <Button color="primary" onClick={actionHandler} disabled={pending}>
                    {token ? 'Nastavit' : 'Resetovat'}
                </Button>
                <Loader open={pending} />
            </DialogActions>
            <DialogContent className={classes.loginFooter}>
                <Typography component="div">
                    <Link to={{ hash: 'login' }}>
                        <Typography display="inline" className={classes.registerButton}>
                            Přihlášení
                        </Typography>
                    </Link>
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

const _mapStateToProps = (state: IState) => ({
    token: getQueryField('token', state),
});

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            forgotAction: userActions.forgot,
            setFormFieldAction: formsDataActions.updateFormField,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(ForgotDialog);
