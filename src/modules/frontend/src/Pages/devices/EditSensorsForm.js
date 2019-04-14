import React, { Fragment, useState, Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { bindActionCreators } from 'redux'
import { prop, filter, pick } from 'ramda'

import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import * as sensorsActions from '../../store/actions/application/devices'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import { getDialogTmp } from 'framework-ui/src/utils/getters'
import InfoAlert from 'framework-ui/src/Components/InfoAlert'
import { getQueryID, getDevices } from '../../utils/getters'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'

function OnlyWritable(device) {
     return device.permissions
}

const styles = theme => ({
     textField: {
          marginLeft: theme.spacing.unit,
          marginRight: theme.spacing.unit,
          marginTop: theme.spacing.unit,
          width: 200,
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     fileLoader: {
          width: '100%',
          paddingLeft: theme.spacing.unit,
          paddingRight: theme.spacing.unit,
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     textArea: {
          marginLeft: theme.spacing.unit,
          marginRight: theme.spacing.unit,
          marginTop: theme.spacing.unit,
          width: '100%',
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     card: {
          overflow: 'auto',
          margin: '0px auto',
          position: 'relative',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 650,
          marginTop: 0,

          [theme.breakpoints.down('sm')]: {
               width: '100%'
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
          marginBottom: theme.spacing.unit * 2,
          [theme.breakpoints.up('sm')]: {
               marginTop: theme.spacing.unit * 2
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
          paddingTop: theme.spacing.unit * 4,
          textAlign: 'center'
     },
     content: {
          paddingLeft: theme.spacing.unit * 6,
          paddingRight: theme.spacing.unit * 6,
          [theme.breakpoints.down('sm')]: {
               // display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
          }
     },
     contentInner: {
          display: 'flex',
          [theme.breakpoints.down('sm')]: {
               display: 'block'
          }
     }
})

class EditDeviceDialog extends Component {
     constructor(props) {
          super(props)
          this.state = {
               pending: false,
               errorOpen: true,
               filled: false
          }
          const { device } = this.props

          if (device && !this.state.filled) this.preFillForm(device)
     }
     componentDidMount() {
          this.mounted = true
     }
     componentWillUnmount() {
          this.mounted = false
     }
     preFillForm = device => {
          this.props.fillEditFormAction(device)
          if (this.mounted) this.setState({ filled: true })
          else this.state.filled = false // eslint-disable-line
     }

     UNSAFE_componentWillReceiveProps({ device }) {
          if (!this.state.filled) {
               this.preFillForm(device)
          }
     }

     setPending = b => this.setState({ pending: b })
     render() {
          const { classes, updateDeviceAction, updateTmpDataAction, apiKey, device } = this.props
          const { pending } = this.state

          const handleSave = async () => {
               this.setPending(true)
               // await updateDeviceAction(device.id)
               this.setPending(false)
          }

          return device ? (
               <Fragment>
                    <Card className={classes.card}>
                         <CardHeader className={classes.header} title={device.title} />
                         <CardContent className={classes.content}>
                              <div className={classes.contentInner}>
                                   <FieldConnector
                                        component="TextField"
                                        fieldProps={{
                                             type: 'text',
                                             className: classes.textField
                                        }}
                                        deepPath="EDIT_SENSORS.title"
                                   />
                                   <FieldConnector
                                        component="TextField"
                                        fieldProps={{
                                             type: 'text',
                                             className: classes.textField
                                        }}
                                        deepPath="EDIT_SENSORS.gpsLat"
                                   />
                                   <FieldConnector
                                        component="TextField"
                                        fieldProps={{
                                             type: 'text',
                                             className: classes.textField
                                        }}
                                        deepPath="EDIT_SENSORS.gpsLng"
                                   />
                              </div>
                              <FieldConnector
                                   component="TextField"
                                   fieldProps={{
                                        type: 'text',
                                        className: classes.textArea,
                                        multiline: true
                                   }}
                                   deepPath="EDIT_SENSORS.description"
                              />
                         </CardContent>
                         <CardActions className={classes.actions}>
                              <Button
                                   color="primary"
                                   variant="contained"
                                   className={classes.button}
                                   onClick={handleSave}
                                   disabled={pending}
                              >
                                   Uložit
                              </Button>
                              <Loader open={pending} />
                         </CardActions>
                    </Card>
               </Fragment>
          ) : (
               <div />
          ) // redux is faster than closing -> before close is device undefined
     }
}

const _mapStateToProps = state => {
     const devices = filter(OnlyWritable, getDevices(state))
     const id = getQueryID(state)
     return {
          device: devices.find(dev => dev.id === id)
     }
}

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               // updateDeviceAction: sensorsActions.updateDevice,
               fillEditFormAction: formsActions.fillForm('EDIT_SENSORS')
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
