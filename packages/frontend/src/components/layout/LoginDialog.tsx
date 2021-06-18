import { IconButton, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AuthType } from 'common/lib/constants';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import Loader from 'framework-ui/lib/Components/Loader';
import { userActions } from 'framework-ui/lib/redux/actions/application/user';
import { getFieldVal, isUserLoggerIn } from 'framework-ui/lib/utils/getters';
import { getAuthorizeHref } from 'frontend/src/oauthConfig';
import { RootState } from 'frontend/src/store/store';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { ReactComponent as SeznamLogo } from './seznamLogo.svg';

const useClasses = makeStyles((theme) => ({
    loginActions: {
        margin: 'auto',
        justifyContent: 'center',
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
    authType: AuthType;
    onSuccess?: () => void;
}
function LoginDialog({ open, onClose, authType, onSuccess }: LoginDialogProps) {
    const [pending, setPending] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);
    const classes = useClasses();
    const dispatch = useAppDispatch();

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
                <div className={classes.oauth}>
                    <IconButton onClick={() => window.open(getAuthorizeHref(), '_self')}>
                        <SeznamLogo />
                    </IconButton>
                </div>
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
                    {(isPasswdType && (
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
                    )) ||
                        (authType && !isPasswdType && 'Nemáte nastavené heslo. Využijte přihlášení přes Seznam')}
                </Grid>
            </DialogContent>
            <DialogActions className={classes.loginActions}>
                <Button color="primary" onClick={actionHandler} disabled={pending}>
                    {!authType ? 'Další' : isPasswdType ? 'Přihlásit' : null}
                </Button>
                <Loader open={pending} />
            </DialogActions>
            {invalidLogin && (
                <DialogContent className={classes.loginFooter}>
                    <Typography component="div">
                        <Link to={{ hash: 'forgot' }}>
                            <Typography display="inline" className={classes.registerButton}>
                                Zapomenuté heslo?
                            </Typography>
                        </Link>
                    </Typography>
                </DialogContent>
            )}
        </Dialog>
    );
}

const _mapStateToProps = (state: RootState) => ({
    authType: getFieldVal('LOGIN.authType')(state) as AuthType,
    userPresence: isUserLoggerIn(state),
});

export default connect(_mapStateToProps)(LoginDialog);
