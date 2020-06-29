import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { bindActionCreators } from 'redux'
import { clone } from 'ramda'

import { getFormData } from 'framework-ui/src/utils/getters'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'
import EditNotify from './editNotifyForm/EditNotify'
import Typography from '@material-ui/core/Typography';
// import { transformSensorsForForm } from '../../utils/transform'
import * as sensorsActions from '../store/actions/application/devices/sensors'
import * as userActions from '../store/actions/application/user'
import { getToken } from '../firebase'

const styles = theme => ({
     textField: {
          width: 200,
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     unit: {
          width: 100,
          [theme.breakpoints.down('sm')]: {
               width: '80%'
          }
     },
     fileLoader: {
          width: '100%',
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
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
               flexDirection: 'column',
               textAlign: 'center',
               paddingLeft: theme.spacing(1),
               paddingRight: theme.spacing(1),
          }
     },

})

const FIELDS = ["JSONkey", "type", "value", "interval", "description"]

function EditDeviceDialog({ updateSensorCount, onPrefill, device, fillEditFormAction, editForm, sensorCount, classes, onUpdate, registerTokenAction, JSONkey, formName }) {
     const mode = formName === "EDIT_NOTIFY_CONTROL" ? "control" : "sensors"
     const [pending, setPending] = useState(false)
     const [loaded, setLoaded] = useState(false)

     useEffect(() => {
          async function preFill() {
               setPending(true)
               if (await onPrefill(device.id)) {
                    setPending(false)
                    setLoaded(true)
               } else setPending(false)

               const token = await getToken()
               console.log("getting token: ", token)
               registerTokenAction(token)
          }
          preFill()

     }, [])

     function removeSensorByIndex(idx) {

          const newEditForm = clone(editForm);
          for (let i = idx + 1; i < sensorCount; i++) {
               FIELDS.forEach(key => {
                    console.log(key, newEditForm[key], newEditForm)
                    if (newEditForm[key]) newEditForm[key][i - 1] = editForm[key][i];
               })
          }
          FIELDS.forEach(key => {
               if (newEditForm[key] && idx < newEditForm[key].length) newEditForm[key].pop();
          })

          newEditForm.count = sensorCount - 1;
          fillEditFormAction(newEditForm)
     }

     const handleSave = async () => {
          setPending(true)
          await onUpdate(device.id)
          setPending(false)
     }

     return loaded && device ? (
          <Fragment>
               <Card className={classes.card}>
                    <CardHeader className={classes.header} title={device.info.title} titleTypographyProps={{ variant: "h3" }} />
                    <CardContent className={classes.content}>
                         <div>
                              {/* <Typography variant="subtitle1" align="center" >Notifikace:</Typography> */}
                              {sensorCount > 0 && [...Array(sensorCount).keys()].map(i => <EditNotify id={i} key={i} onDelete={removeSensorByIndex} recipe={device[mode].recipe} formName={formName} JSONkey={JSONkey} />)}

                         </div>
                         <IconButton className={classes.addButton} aria-label="Add a sensor" onClick={() => updateSensorCount(sensorCount + 1)}>
                              <AddCircle className={classes.addIcon} />
                         </IconButton>
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
     ) : pending ? <Loader open={pending} /> : <Typography >Nelze načíst data</Typography>

}

const _mapStateToProps = (state, { formName }) => {
     const editForm = getFormData(formName)(state);
     const sensorCount = editForm ? editForm.count : 0;
     return {
          sensorCount,
          editForm,
     }
}

const _mapDispatchToProps = (dispatch, { formName }) => (
     {
          ...bindActionCreators(
               {
                    updateSensorCount: formsActions.updateFormField(`${formName}.count`),
                    fillEditFormAction: formsActions.fillForm(`${formName}`),
                    registerTokenAction: userActions.registerToken,
               },
               dispatch,
          ),
     })

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
