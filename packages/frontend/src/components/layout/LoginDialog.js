import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Loader from 'framework-ui/lib/Components/Loader'
import { login, fetchAuthType } from 'framework-ui/lib/redux/actions/application/user'
import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import { getFieldVal, getUserPresence } from 'framework-ui/lib/utils/getters'
import { AuthTypes } from 'common/lib/constants'
import * as deviceActions from '../../store/actions/application/devices'

const styles = theme => ({
    loginTitle: {
        margin: '0 auto',
        paddingBottom: 10,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 0
        },
    },
    loginActions: {
        margin: 'auto',
        justifyContent: 'center'
    },
    content: {
        position: "relative",
        width: 400,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        overflowY: "visible",

        [theme.breakpoints.down('sm')]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
        },
    },
    loginFooter: {
        textAlign: 'center',
        paddingBottom: theme.spacing(2),
        overflowY: "visible",
    },
    registerButton: {
        cursor: 'pointer'
    },
    textField: {
        marginTop: theme.spacing(1),
        width: "calc(100% - 20px)"
    },
})

let timer = null
function onStopTyping(callback) {
    return e => {
        clearTimeout(timer)
        timer = setTimeout(callback, 800)
    }
}

function LoginDialog({ open, onClose, classes, loginAction, authType, fetchAuthTypeAction, fetchDevicesAction }) {
    const [pending, setPending] = useState(false)

    function fetchAuthType() {
        if (pending) return
        clearTimeout(timer)
        setPending(true)
        fetchAuthTypeAction().then(() => {
            setPending(false)
        })
    }
    const loginMyAction = () => {
        loginAction().then(success => {
            if (success) {
                fetchDevicesAction()     // refresh devices for logged user
                onClose()
            }
        })
    }
    const actionHandler = (!authType && fetchAuthType) || loginMyAction

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title" className={classes.loginTitle}>
                Přihlášení
               </DialogTitle>
            <DialogContent className={classes.content}>
                <FieldConnector
                    deepPath="LOGIN.userName"
                    autoFocus
                    className={classes.textField}
                    onEnter={actionHandler}
                    onChange={onStopTyping(fetchAuthType)}
                    fieldProps={{
                        autoComplete: 'off',
                    }}
                />

                {authType === AuthTypes.PASSWD && (
                    <FieldConnector
                        deepPath="LOGIN.password"
                        component="PasswordField"
                        autoFocus
                        className={classes.textField}
                        onEnter={actionHandler}
                    />
                )}
            </DialogContent>
            <DialogActions className={classes.loginActions}>
                <Button color="primary" onClick={actionHandler} disabled={pending}>
                    {!authType ? "Další" : "Přihlásit"}
                </Button>
                <Loader open={pending} />
            </DialogActions>
            <DialogContent className={classes.loginFooter}>
                <Typography component="div">
                    Nemáte účet?{' '}
                    <Link to={{ pathname: '/registerUser', hash: '' }}>
                        <Typography color="primary" display="inline" className={classes.registerButton}>
                            Zaregistrujte se!
                              </Typography>
                    </Link>
                </Typography>
            </DialogContent>
        </Dialog>
    )
}

const _mapStateToProps = state => ({
    authType: getFieldVal('LOGIN.authType')(state),
    userPresence: getUserPresence(state)
})

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            loginAction: login,
            fetchAuthTypeAction: fetchAuthType,
            fetchDevicesAction: deviceActions.fetch
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(LoginDialog))
