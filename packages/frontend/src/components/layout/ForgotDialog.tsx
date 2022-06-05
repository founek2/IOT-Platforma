import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import Loader from 'framework-ui/src/Components/Loader';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { RootState } from 'frontend/src/store/store';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { userActions } from '../../store/actions/application/user';
import { getQueryField } from '../../utils/getters';

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
}
function ForgotDialog({ open, onClose, token }: LoginDialogProps) {
    const classes = useClasses();
    const [pending, setPending] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) formsDataActions.setFormField({ deepPath: 'FORGOT_PASSWORD.token', value: token });
    }, [token]);

    const forgotHandler = async () => {
        setPending(true);
        await dispatch(userActions.forgot('FORGOT'));
        setPending(false);
    };

    const passwordHandler = async () => {
        setPending(true);
        await dispatch(userActions.forgot('FORGOT_PASSWORD'));
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

const _mapStateToProps = (state: RootState) => ({
    token: getQueryField('token', state),
});

export default connect(_mapStateToProps)(ForgotDialog);
