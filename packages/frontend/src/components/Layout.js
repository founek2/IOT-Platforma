import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { userLogOut } from 'framework-ui/lib/redux/actions/application/user'
import * as formsDataActions from 'framework-ui/lib/redux/actions/formsData'
import { bindActionCreators } from 'redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { getUserInfo, getGroups, getUserPresence, isUrlHash, getUsers, getUser } from 'framework-ui/lib/utils/getters'
import { connect } from 'react-redux'
import LoginDialog from './layout/LoginDialog'
import Button from '@material-ui/core/Button'
import FullScreenDialog from 'framework-ui/lib/Components/FullScreenDialog';
import * as userActions from 'framework-ui/lib/redux/actions/application/user';

import UserMenu from './layout/UserMenu'
import SideMenu from './layout/SideMenu'
import EditUser from '../Pages/userManagement/EditUser'
import { getQueryID } from '../utils/getters'

const styles = {
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    loginButton: {
        color: 'white'
    },
    noLinkStyles: {
        color: "inherit",
        textDecoration: "none"
    }
}

function Layout({ classes, userPresence, loginOpen, history, userInfo, removeLoginFormAction, editUserOpen, userToEdit, updateUserAction }) {
    const [mainMenuOpen, setMainMenuO] = useState(false)
    const setMainMenuOpen = bool => () => setMainMenuO(bool)

    return (<Fragment>
        <AppBar position="static">
            <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={setMainMenuOpen(true)}>
                    <MenuIcon />
                </IconButton>
                <Link className={`${classes.flex} ${classes.noLinkStyles}`} to="/">
                    <Typography variant="h5" color="inherit">
                        IOT Platforma
                         </Typography>
                </Link>
                {userPresence ? (
                    <UserMenu />
                ) : (
                        <Link to={{ hash: 'login' }}>
                            <Button variant="text" className={classes.loginButton}>
                                Login
                              </Button>
                        </Link>
                    )}
                <LoginDialog open={loginOpen} onClose={
                    () => {
                        history.push({ hash: '' })
                        removeLoginFormAction()
                    }
                } />
            </Toolbar>
            <SideMenu open={mainMenuOpen} onClose={setMainMenuOpen(false)} onOpen={setMainMenuOpen(true)} />
        </AppBar>
        <FullScreenDialog
            open={Boolean(editUserOpen && userToEdit)}
            onClose={() => history.push({ hash: '', search: '' })}
            heading="Editace uživatele"
        >
            <EditUser
                onButtonClick={() => updateUserAction(userToEdit.id)}
                buttonLabel="Uložit"
                user={userToEdit}
            />
        </FullScreenDialog>
    </Fragment>
    )
}

const _mapStateToProps = state => {
    return {
        userInfo: getUserInfo(state),
        groups: getGroups(state),
        userPresence: getUserPresence(state),
        loginOpen: isUrlHash('#login')(state),
        editUserOpen: isUrlHash('#editUser')(state),
        userToEdit: getUser(state)
    }
}

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            logOut: userLogOut,
            removeLoginFormAction: formsDataActions.removeForm("LOGIN"),
            updateUserAction: userActions.updateUser,
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(Layout))
