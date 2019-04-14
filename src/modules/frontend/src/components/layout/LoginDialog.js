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

import Loader from 'framework-ui/src/Components/Loader'
import chainHandler from 'framework-ui/src/utils/chainHandler'
import { login, fetchAuthType } from 'framework-ui/src/redux/actions/application/user'
import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import { getFieldVal, getUserPresence } from 'framework-ui/src/utils/getters'
import { AuthTypes } from '../../constants'

const styles = theme => ({
     loginTitle: {
          margin: '0 auto',
          paddingBottom: 10
     },
     loginActions: {
          margin: 'auto',
          justifyContent: 'center'
     },
     content: {
          width: 367,

          [theme.breakpoints.down('md')]: {
               width: 300
          },
          [theme.breakpoints.up('sm')]: {
               marginLeft: theme.spacing.unit * 2,
               marginRight: theme.spacing.unit * 2
          },

          [theme.breakpoints.down('sm')]: {
               width: 240
          }
     },
     loginFooter: {
          textAlign: 'center',
          overflowY: 'hidden'
     },
     registerButton: {
          cursor: 'pointer'
     },
     textField: {
          marginTop: theme.spacing.unit
     }
})

let timer = null
function onStopTyping(callback) {
     return e => {
          clearTimeout(timer)
          timer = setTimeout(callback, 800)
     }
}

let userNameInput = React.createRef()
let passwordInput = React.createRef()

function LoginDialog({ open, onClose, classes, loginAction, authType, fetchAuthTypeAction, userPresence }) {
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
          loginAction().then(success => success && onClose())
     }
     const actionHandler = (!authType && fetchAuthType) || loginMyAction

     return (
          <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title" className={classes.loginTitle}>
                    Přihlášení
               </DialogTitle>
               <DialogContent className={classes.content}>
                    <FieldConnector
                         deepPath="LOGIN.userName"
                         name="userName"
                         autoFocus
                         onEnter={actionHandler}
                         onChange={onStopTyping(fetchAuthType)}
                         fieldProps={{
                              type: 'text',
                              autoComplete: 'off',
                              fullWidth: true,
                              inputRef: field => (userNameInput = field)
                         }}
                    />

                    {authType === AuthTypes.PASSWD && (
                         <FieldConnector
                              deepPath="LOGIN.password"
                              component="TextField"
                              name="password"
                              autoFocus
                              className={classes.textField}
                              onEnter={actionHandler}
                              fieldProps={{
                                   type: 'password',
                                   fullWidth: true,
                                   inputRef: field => (passwordInput = field)
                              }}
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
                              <Typography color="primary" inline={true} className={classes.registerButton}>
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
               fetchAuthTypeAction: fetchAuthType
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(LoginDialog))
