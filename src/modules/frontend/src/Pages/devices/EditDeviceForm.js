import React, { Fragment, useState, Component, useEffect } from 'react'
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { bindActionCreators } from 'redux'
import { prop, filter, pick } from 'ramda'

import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import * as deviceActions from '../../store/actions/application/devices'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import { getDialogTmp, getFieldVal, getRegisteredField } from 'framework-ui/src/utils/getters'
import InfoAlert from 'framework-ui/src/Components/InfoAlert'
import { getQueryID, getDevices } from '../../utils/getters'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'
import AlertDialog from 'framework-ui/src/Components/AlertDialog'
import TextField from 'framework-ui/src/Components/fieldConnector/TextField.js'

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
          marginBottom: theme.spacing(2),
          [theme.breakpoints.up('sm')]: {
               marginTop: theme.spacing(2)
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
          paddingLeft: theme.spacing(6),
          paddingRight: theme.spacing(6),
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
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          paddingTop: theme.spacing(3)
     },
})

function EditDeviceDialog({ classes, updateDeviceAction, updateTmpDataAction, apiKey, device, fillEditFormAction, deleteDeviceAction, editFormTopic, fetchApiKeyAction, topicRegisteredField }) {
     useEffect(() => {
          const { description, title, gpsLat, gpsLng, publicRead, topic } = device
          fillEditFormAction({ description, title, gpsLat, gpsLng, publicRead, topic })
     }, [])
     const [pending, setPending] = useState(false)
     const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
     const [openTopicDialog, setOpenTopicDialog] = useState(false)

     const handleSave = async () => {
          setPending(true)
          await updateDeviceAction(device.id)
          setPending(false)
     }
     const handleDelete = async () => {
          setPending(true)
          await deleteDeviceAction(device.id)
          setPending(false)
     }

     const handleFetchApiKey = async () => {
          setPending(true)
          await fetchApiKeyAction(device.id)
          setPending(false)
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
                         <TextField
                              className={classes.textArea}
                              value={`/${device.createdBy}${editFormTopic || ""}`}
                              error={topicRegisteredField ? !topicRegisteredField.valid : false}
                              helperText={topicRegisteredField && topicRegisteredField.errorMessages ? topicRegisteredField.errorMessages[0] : ""}
                              FormHelperTextProps={{ error: topicRegisteredField ? !topicRegisteredField.valid : false }}
                              disabled
                              label="Topic"
                              inputProps={{ style: { cursor: "pointer" } }}
                              onClick={() => setOpenTopicDialog(true)}
                         />
                         <FieldConnector
                              component="Checkbox"
                              deepPath="EDIT_DEVICE.publicRead"
                         />
                    </CardContent>
                    <CardActions className={classes.actions}>
                         <Button
                              variant="contained"
                              className={classes.button}
                              onClick={() => setOpenDeleteDialog(true)}
                              disabled={pending}
                         >
                              Smazat
                              </Button>
                         <Button
                              variant="contained"
                              className={classes.button}
                              onClick={handleFetchApiKey}
                              disabled={pending}
                         >
                              API klíč
                              </Button>
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
               <AlertDialog
                    open={openDeleteDialog}
                    onAgree={() => { setOpenDeleteDialog(false); handleDelete() }}
                    onClose={() => setOpenDeleteDialog(false)}
                    title="Odstranění zařízení"
                    content="Opravdu chcete odstranit zařízení? Tato akce je nevratná."
               />
               <Dialog open={openTopicDialog} onClose={() => setOpenTopicDialog(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" >
                         Upozornění!
               </DialogTitle>
                    <DialogContent >
                         <DialogContentText>
                              Pokud upravíte topic, tak je třeba pře-flashovat zařízení, aby si stáhl aktuální topic do paměti jinak přestane fungovat.
                         </DialogContentText>
                         <FieldConnector
                              deepPath="EDIT_DEVICE.topic"
                              name="topic"
                              autoFocus
                              onEnter={() => setOpenTopicDialog(false)}
                         />
                    </DialogContent>
                    <DialogActions className={classes.loginActions}>
                         <Button
                              color="primary"
                              onClick={() => setOpenTopicDialog(false)}>
                              Zavřít
                         </Button>
                         <Loader open={pending} />
                    </DialogActions>
               </Dialog>
          </Fragment>
     ) : (
               <div />
          ) // onClose is removed id from url -> device is undefined before complete close
}

const _mapStateToProps = state => {
     return {
          apiKey: prop('apiKey')(getDialogTmp(state)),
          editFormTopic: getFieldVal("EDIT_DEVICE.topic", state),
          topicRegisteredField: getRegisteredField("EDIT_DEVICE.topic", state)
     }
}

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               updateDeviceAction: deviceActions.updateDevice,
               updateTmpDataAction: updateTmpData,
               fillEditFormAction: formsActions.fillForm('EDIT_DEVICE'),
               deleteDeviceAction: deviceActions.deleteDevice,
               fetchApiKeyAction: deviceActions.fetchApiKey,
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
