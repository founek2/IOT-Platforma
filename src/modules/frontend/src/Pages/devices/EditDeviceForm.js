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

const styles = theme => ({
     fileLoader: {
          width: '100%',
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     textArea: {
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
     },
     media: {
          height: 0,
          paddingTop: '56.25%' // 16:9
     },
     mediaWrapper: {
          width: 300,
          paddingLeft: theme.spacing.unit,
          paddingRight: theme.spacing.unit,
          paddingTop: theme.spacing.unit * 3
     }
})

class EditDeviceDialog extends Component {
     constructor(props) {
          super(props)
          this.state = {
               pending: false,
          }
          const {imgPath, description, title, gpsLat, id, gpsLng, publicRead} = this.props.device
          this.props.fillEditFormAction({imgPath, description, title, gpsLat, id, gpsLng, publicRead})
     }

     setPending = b => this.setState({ pending: b })

     render() {
          const { classes, updateDeviceAction, updateTmpDataAction, apiKey, device } = this.props
          const { pending } = this.state

          const handleSave = async () => {
               this.setPending(true)
               await updateDeviceAction(device.id)
               this.setPending(false)
          }
          return device ? (
               <Fragment>
                    <Card className={classes.card}>
                         <CardHeader className={classes.header} title={device.title} />
                         <CardContent className={classes.content}>
                              <div className={classes.contentInner}>
                                   <div>
                                        <div className={classes.mediaWrapper}>
                                             <CardMedia className={classes.media} image={device.imgPath} />
                                        </div>
                                        <FieldConnector
                                             component="FileLoader"
                                             fieldProps={{
                                                  className: classes.fileLoader
                                             }}
                                             deepPath="EDIT_DEVICE.image"
                                        />
                                   </div>
                                   <div>
                                        <FieldConnector
                                             component="TextField"
                                             deepPath="EDIT_DEVICE.title"
                                        />
                                        <FieldConnector
                                             component="TextField"
                                             deepPath="EDIT_DEVICE.gpsLat"
                                        />
                                        <FieldConnector
                                             component="TextField"
                                             deepPath="EDIT_DEVICE.gpsLng"
                                        />
                                   </div>
                              </div>
                              <FieldConnector
                                   component="TextField"
                                   fieldProps={{
                                        type: 'text',
                                        className: classes.textArea,
                                        multiline: true
                                   }}
                                   deepPath="EDIT_DEVICE.description"
                              />
                               <FieldConnector
                                             component="Checkbox"
                                             deepPath="EDIT_DEVICE.publicRead"
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
                    <InfoAlert
                         title={`Váš API Key pro zařízení:	${apiKey}`}
                         content="Tímto klíčem se bude zařízení autorizovat serveru, pro zajištění důvěry."
                         onClose={() => updateTmpDataAction({ dialog: {} })}
                         open={!!apiKey}
                    />
               </Fragment>
          ) : (
               <div />
          ) // onClose is removed id from url -> device is undefined before complete close
     }
}

const _mapStateToProps = state => {
     return {
          apiKey: prop('apiKey')(getDialogTmp(state)),
     }
}

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               updateDeviceAction: sensorsActions.updateDevice,
               updateTmpDataAction: updateTmpData,
               fillEditFormAction: formsActions.fillForm('EDIT_DEVICE')
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
