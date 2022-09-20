import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AuthType } from 'common/src/constants';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import Loader from 'framework-ui/src/Components/Loader';
import { getFieldVal, isUserLoggerIn } from 'framework-ui/src/utils/getters';
import { RootState } from 'frontend/src/store/store';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { userActions } from '../../store/actions/application/user';
import OAuthButtons from './OAuthButtons';

const useClasses = makeStyles((theme) => ({
    loginActions: {
        margin: 'auto',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
        },
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(4),
    },
    content: {
        position: 'relative',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    loginFooter: {
        textAlign: 'center',
        paddingBottom: theme.spacing(2),
        overflowY: 'visible',
        marginTop: -theme.spacing(2),
    },
    registerButton: {
        cursor: 'pointer',
        color: grey[500],
    },
    paperColored: {
        backgroundColor: theme.palette.primary.main,
        paddingTop: 20,
        paddingBottom: 20,
        textAlign: 'center',
        marginTop: -50,
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        color: '#fff',
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 300,
    },
    whitePaper: {
        overflow: 'visible',
    },
    grid: {
        marginTop: '1em',
        [theme.breakpoints.down('md')]: {
            marginTop: '0',
        },
    },
    oauth: {
        marginTop: '1em',
    },
}));

let timer: NodeJS.Timeout;
function onStopTyping(callback: (...args: any[]) => void) {
    return () => {
        clearTimeout(timer);
        timer = setTimeout(callback, 800);
    };
}

interface LoginDialogProps {
    open: boolean;
    onClose?: DialogProps['onClose'];
    onSuccess?: () => void;
}
function LoginDialog({ open, onClose, onSuccess }: LoginDialogProps) {
    const [pending, setPending] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const authType: AuthType = useAppSelector(getFieldVal('LOGIN.authType'));

    async function fetchAuthType() {
        if (pending) return;
        clearTimeout(timer);
        setPending(true);
        await dispatch(userActions.fetchAuthType());
        setPending(false);
    }
    const loginMyAction = async () => {
        setPending(true);
        const success = await dispatch(userActions.login());
        setPending(false);
        if (success) onSuccess && onSuccess();
        else setInvalidLogin(true);
    };
    const isPasswdType = authType === AuthType.passwd;

    const actionHandler = !authType || !isPasswdType ? fetchAuthType : loginMyAction;

    return (
        <Dialog
            open={open}
            classes={{
                paper: classes.whitePaper,
            }}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="xs"
            fullWidth
            // fullScreen={true}
        >
            <Paper className={classes.paperColored}>
                <Typography component="h4" className={classes.title}>
                    Přihlášení
                </Typography>
                <OAuthButtons className={classes.oauth} />
            </Paper>
            <DialogContent className={classes.content}>
                <Typography align="center">Or Be classical</Typography>
                <Grid container justify="center" spacing={2} className={classes.grid}>
                    <Grid item md={10} xs={12}>
                        <FieldConnector
                            deepPath="LOGIN.userName"
                            autoFocus
                            onEnter={actionHandler}
                            onChange={onStopTyping(fetchAuthType)}
                            fieldProps={{
                                autoComplete: 'off',
                                fullWidth: true,
                            }}
                        />
                    </Grid>
                    {isPasswdType ? (
                        <Grid item md={10} xs={12}>
                            <FieldConnector
                                deepPath="LOGIN.password"
                                component="PasswordField"
                                autoFocus
                                fieldProps={{
                                    fullWidth: true,
                                }}
                                onEnter={actionHandler}
                            />
                        </Grid>
                    ) : null}
                    {authType && !isPasswdType ? 'Nemáte nastavené heslo. Využijte přihlášení přes Seznam' : null}
                </Grid>
            </DialogContent>
            <DialogActions className={classes.loginActions}>
                <Button color="primary" onClick={actionHandler} disabled={pending}>
                    {!authType ? 'Další' : isPasswdType ? 'Přihlásit' : null}
                </Button>
                <Loader open={pending} />
            </DialogActions>
            {invalidLogin && (
                <Typography component="div" className={classes.loginFooter}>
                    <Link to={{ hash: 'forgot' }}>
                        <Typography display="inline" className={classes.registerButton}>
                            Zapomenuté heslo?
                        </Typography>
                    </Link>
                </Typography>
            )}
        </Dialog>
    );
}

export default LoginDialog;
