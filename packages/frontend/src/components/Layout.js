import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import FullScreenDialog from 'framework-ui/lib/Components/FullScreenDialog';
import * as userActions from 'framework-ui/lib/redux/actions/application/user';
import { userLogOut } from 'framework-ui/lib/redux/actions/application/user';
import * as formsDataActions from 'framework-ui/lib/redux/actions/formsData';
import { getGroups, getUser, getUserInfo, getUserPresence, isUrlHash } from 'framework-ui/lib/utils/getters';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import EditUser from '../Pages/userManagement/EditUser';
import LoginDialog from './layout/LoginDialog';
import SideMenu from './layout/SideMenu';
import UserMenu from './layout/UserMenu';
import ForgotDialog from './layout/ForgotDialog';
import { useMediaQuery, useTheme } from '@material-ui/core';

const styles = {
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
};

function Layout({
    classes,
    userPresence,
    loginOpen,
    history,
    userInfo,
    removeLoginFormAction,
    editUserOpen,
    userToEdit,
    updateUserAction,
    forgotOpen,
    removeForgotFormAction,
}) {
    const [mainMenuOpen, setMainMenuO] = useState(false);
    const setMainMenuOpen = (bool) => () => setMainMenuO(bool);
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('sm'));

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
                            Platform
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
                    removeLoginFormAction();
                }}
                onSuccess={() => history.push('/devices')}
            />
            <ForgotDialog
                open={forgotOpen}
                onClose={() => {
                    history.push({ hash: '' });
                    removeForgotFormAction();
                }}
            />
            <FullScreenDialog
                open={Boolean(editUserOpen && userToEdit)}
                onClose={() => history.push({ hash: '', search: '' })}
                heading="Editace uživatele"
            >
                <EditUser
                    onButtonClick={async () => {
                        const result = await updateUserAction(userToEdit.id);
                        console.log(result);
                        if (result) history.push({ hash: '', search: '' });
                    }}
                    buttonLabel="Uložit"
                    user={userToEdit}
                />
            </FullScreenDialog>
        </Fragment>
    );
}

const _mapStateToProps = (state) => {
    return {
        userInfo: getUserInfo(state),
        groups: getGroups(state),
        userPresence: getUserPresence(state),
        loginOpen: isUrlHash('#login')(state),
        forgotOpen: isUrlHash('#forgot')(state),
        editUserOpen: isUrlHash('#editUser')(state),
        userToEdit: getUser(state),
    };
};

const _mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            logOut: userLogOut,
            removeLoginFormAction: formsDataActions.removeForm('LOGIN'),
            updateUserAction: userActions.updateUser,
            removeForgotFormAction: formsDataActions.removeForm('FORGOT_PASSWORD'),
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Layout));
