import React, { useState } from 'react'
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
import { getUserInfo, getGroups, getUserPresence, isUrlHash } from 'framework-ui/lib/utils/getters'
import { connect } from 'react-redux'
import LoginDialog from './layout/LoginDialog'
import Button from '@material-ui/core/Button'

import UserMenu from './layout/UserMenu'
import SideMenu from './layout/SideMenu'

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

function Layout({ classes, userPresence, loginOpen, history, userInfo, removeLoginFormAction }) {
    const [mainMenuOpen, setMainMenuO] = useState(false)
    const setMainMenuOpen = bool => () => setMainMenuO(bool)

    return (
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
    )
}

const _mapStateToProps = state => ({
    userInfo: getUserInfo(state),
    groups: getGroups(state),
    userPresence: getUserPresence(state),
    loginOpen: isUrlHash('#login')(state),
})

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            logOut: userLogOut,
            removeLoginFormAction: formsDataActions.removeForm("LOGIN")
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(Layout))
