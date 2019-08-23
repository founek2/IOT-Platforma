import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { bindActionCreators } from 'redux'
import { prop } from 'ramda'

import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import * as sensorsActions from '../../store/actions/application/devices'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import { getDialogTmp } from 'framework-ui/src/utils/getters'
import InfoAlert from 'framework-ui/src/Components/InfoAlert'
import { getDeviceUser } from '../../utils/getters';

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
          [theme.breakpoints.down('sm')]: {
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
          }
     },
     textArea: {
          width: "100%"
     }
})

function CreateDeviceDialog({ classes, createSensorAction, updateTmpDataAction, apiKey, deviceUser }) {
     const [pending, setPending] = useState(false)
     async function handleCreate() {
          setPending(true);
          await createSensorAction()
          setPending(false)
     }

     return (
          <Fragment>
               <Card className={classes.card}>
                    <CardHeader className={classes.header} title="Vytvoření zařízení" />
                    <CardContent className={classes.content}>
                         <FieldConnector
                              component="TextField"
                              fieldProps={{
                                   type: 'text',
                              }}
                              deepPath="CREATE_DEVICE.title"
                         />
                         <FieldConnector
                              component="FileLoader"
                              deepPath="CREATE_DEVICE.image"
                         />
                         <FieldConnector
                              component="TextField"
                              deepPath="CREATE_DEVICE.gpsLat"
                         />
                         <FieldConnector
                              component="TextField"
                              deepPath="CREATE_DEVICE.gpsLng"
                         />
                         <FieldConnector
                              component="TextField"
                              fieldProps={{
                                   placeholder: "/house/bedroom/lamp"
                              }}
                              className={classes.textArea}
                              deepPath="CREATE_DEVICE.topic"
                         />
                         <FieldConnector
                              component="TextField"
                              fieldProps={{
                                   multiline: true
                              }}
                              className={classes.textArea}
                              deepPath="CREATE_DEVICE.description"
                         />
                         <FieldConnector
                              component="Checkbox"
                              deepPath="CREATE_DEVICE.publicRead"
                         />
                    </CardContent>
                    <CardActions className={classes.actions}>
                         <Button
                              color="primary"
                              variant="contained"
                              className={classes.button}
                              onClick={handleCreate}
                              disabled={pending}
                         >
                              Vytvořit
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
     )
}

const _mapStateToProps = state => ({
     apiKey: prop("apiKey")(getDialogTmp(state)),
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               createSensorAction: sensorsActions.createDevice,
               updateTmpDataAction: updateTmpData
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(CreateDeviceDialog))
