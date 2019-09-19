import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { registerAngLogin, register } from 'framework-ui/src/redux/actions/application/user'
import { bindActionCreators } from 'redux'
import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { getFormData } from 'framework-ui/src/utils/getters'
import { o, prop } from 'ramda'
import { AuthTypes } from '../constants'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import UserForm from '../components/UserForm'

const styles = theme => ({
     card: {
          overflow: 'auto',
          margin: '0px auto',
          position: 'relative',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 470,
          marginTop: 0,

          [theme.breakpoints.down('sm')]: {
               width: '100%',
               //height: '100%'
          },
          [theme.breakpoints.down('xs')]: {
               width: '100%'
          },
          [theme.breakpoints.up('lg')]: {
               //height: 410
          }
     },
     actions: {
		marginBottom: theme.spacing(2),
          [theme.breakpoints.up('sm')]: {
               marginTop: theme.spacing(2),
          },
          margin: 'auto',
          width: 400,
          justifyContent: 'center',

          [theme.breakpoints.down('sm')]: {
               width: '100%',
               justifyContent: 'flex-start',
               flexDirection: 'column'
          }
     },
     header: {
          paddingBottom: 0,
          paddingTop: theme.spacing(4),
          textAlign: 'center'
     },
     content: {
          [theme.breakpoints.down('sm')]: {
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
          }
     }
})

export const AuthTypesWithText = [{ value: AuthTypes.WEB_AUTH, text: 'web API' }]

function RegisterUser({ classes, registerAndLoginAction, authType, registerAction }) {
     const [pending, setPending] = useState(false)
     const [autoLogin, setAutoLogin] = useState(true)
     const handleRegister = async () => {
          setPending(true)
          const action = autoLogin ? registerAndLoginAction : registerAction
		await action()
		setPending(false)
     }
     return (
          <Card className={classes.card}>
               <CardHeader className={classes.header} title="Registrace" />
               <CardContent className={classes.content}>
                    {/* <FieldConnector
                         fieldProps={{
                              type: 'text',
                         }}
                         deepPath="REGISTRATION.firstName"
                    />
                    <FieldConnector
                         fieldProps={{
                              type: 'text',
                         }}
                         deepPath="REGISTRATION.lastName"
                    />
                    <FieldConnector
                         fieldProps={{
                              type: 'text',
                         }}
                         deepPath="REGISTRATION.userName"
                    />
                    <FieldConnector
                         fieldProps={{
                              type: 'email',
                         }}
                         deepPath="REGISTRATION.email"
                    />
                    <FieldConnector
					component="PasswordField"
                         deepPath="REGISTRATION.password"
                    />
                    <FieldConnector
                         component="Select"
                         deepPath="REGISTRATION.authType"
                         selectOptions={[
                              <MenuItem value="" key="enum">
                                   <em />
                              </MenuItem>,
                              ...AuthTypesWithText.map(
                                   ({ value, text }) =>
                                        value !== 'passwd' && (
                                             <MenuItem value={value} key={value}>
                                                  {text}
                                             </MenuItem>
                                        )
                              )
                         ]}
                    /> */}
                    <UserForm formName="REGISTRATION"/>
               </CardContent>
               <CardActions className={classes.actions}>
                    <FormControlLabel
                         control={
                              <Checkbox
                                   checked={autoLogin}
                                   onChange={e => setAutoLogin(e.target.checked)}
                                   value="checkedB"
                                   color="default"
                              />
                         }
                         label="Po registraci přihlásit"
                    />
                    <Button
                         color="primary"
                         variant="contained"
                         className={classes.button}
                         onClick={handleRegister}
                         disabled={pending}
                    >
                         Registrovat
                    </Button>
                    <Loader open={pending} />
               </CardActions>
          </Card>
     )
}

const _mapStateToProps = state => ({
     authType: o(prop('authType'), getFormData('REGISTRATION'))(state),
     kekel: 'ble'
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               registerAndLoginAction: registerAngLogin,
               registerAction: register
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(RegisterUser))
