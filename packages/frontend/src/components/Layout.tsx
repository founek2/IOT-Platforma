import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { isUrlHash, isUserLoggerIn } from 'framework-ui/lib/utils/getters';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { getGroups } from '../utils/getters';
import ForgotDialog from './layout/ForgotDialog';
import LoginDialog from './layout/LoginDialog';
import SideMenu from './layout/SideMenu';
import UserMenu from './layout/UserMenu';

const useClasses = makeStyles({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    loginButton: {
        color: 'white',
    },
    noLinkStyles: {
        color: 'inherit',
        textDecoration: 'none',
    },
});

interface LayoutProps {
    userPresence: boolean;
    loginOpen: boolean;
    forgotOpen: boolean;
}
function Layout({ userPresence, loginOpen, forgotOpen }: LayoutProps) {
    const history = useHistory();
    const [mainMenuOpen, setMainMenuO] = useState(false);
    const setMainMenuOpen = (bool: boolean) => () => setMainMenuO(bool);
    const classes = useClasses();
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('sm'));
    const dispatch = useAppDispatch();

    return (
        <Fragment>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={setMainMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link className={`${classes.flex} ${classes.noLinkStyles}`} to="/devices">
                        <Typography variant="h5" color="inherit">
                            {isWide ? 'IoT' : ''} Domu
                        </Typography>
                    </Link>
                    {userPresence ? (
                        <UserMenu />
                    ) : (
                        <Link to={{ hash: 'login' }}>
                            {isWide ? (
                                <Button variant="text" className={classes.loginButton}>
                                    Přihlášení
                                </Button>
                            ) : (
                                <IconButton className={classes.loginButton}>
                                    <SendIcon />
                                </IconButton>
                            )}
                        </Link>
                    )}
                </Toolbar>
                <SideMenu open={mainMenuOpen} onClose={setMainMenuOpen(false)} onOpen={setMainMenuOpen(true)} />
            </AppBar>
            <LoginDialog
                open={loginOpen}
                onClose={() => {
                    history.push({ hash: '' });
                    dispatch(formsDataActions.removeForm('LOGIN'));
                }}
                onSuccess={() => history.push('/devices')}
            />
            <ForgotDialog
                open={forgotOpen}
                onClose={() => {
                    history.push({ hash: '' });
                    dispatch(formsDataActions.removeForm('FORGOT_PASSWORD'));
                }}
            />
        </Fragment>
    );
}

const _mapStateToProps = (state: any) => {
    return {
        groups: getGroups(state),
        userPresence: isUserLoggerIn(state),
        loginOpen: isUrlHash('#login')(state),
        forgotOpen: isUrlHash('#forgot')(state),
    };
};

export default connect(_mapStateToProps)(Layout);
