import React, { Fragment, Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import DeviceBox from './devices/DeviceBox'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { filter } from 'ramda'

import { getUserPresence, isUrlHash } from 'framework-ui/src/utils/getters'
import CreateDeviceForm from './devices/CreateDeviceForm'
import EditDeviceForm from './devices/EditDeviceForm'
import EditSensorsForm from './devices/EditSensorsForm'
import FullScreenDialog from 'framework-ui/src/Components/FullScreenDialog'
import { getDevices } from '../utils/getters'
import * as deviceActions from '../store/actions/application/devices'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'
import { getQueryID } from '../utils/getters'
import EditPermissions from './devices/EditPermissions';
import EditControlForm from './devices/EditControlForm'

function isWritable(device) {
     return device.permissions && device.permissions.write
}

const styles = theme => ({
     cardPlus: {
          width: '25%',
          height: 200,
          display: 'flex',
          float: 'left',
          [theme.breakpoints.down('sm')]: {
               width: '100%'
          }
     },
     wraper: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%'
     },
     addButton: {
          color: theme.grey,
          fontSize: 60,
          display: 'block',
          height: 87,
          margin: '0 auto'
     },
     addIcon: {
          fontSize: 60
     }
})

class Devices extends Component {
     componentDidMount() {
          this.props.fetchDevicesAction()
     }
     render() {
          const {
               classes,
               openCreateDialog,
               history,
               devices,
               openEditDialog,
               resetEditDeviceA,
               resetEditSensorsA,
               resetEditControlA,
               resetEditPermissionsA,
               openSensorsDialog,
               selectedDevice,
               deleteDeviceAction,
               openPermissionsDialog,
               openControlDialog,
          } = this.props
          return (
               <Fragment>
                    {devices.map(data => (
                         <DeviceBox device={data} key={data.id} onDelete={deleteDeviceAction}/>
                    ))}

                    <Fragment>
                         <Card className={classes.cardPlus}>
                              <div className={classes.wraper}>
                                   <Link to={{ hash: 'createDevice' }}>
                                        <IconButton className={classes.addButton} aria-label="Add an alarm">
                                             <AddCircle className={classes.addIcon} />
                                        </IconButton>
                                   </Link>
                              </div>
                         </Card>
                         <FullScreenDialog
                              open={openCreateDialog}
                              onClose={() => history.push({ hash: '' })}
                              heading="Tvorba zařízení"
                         >
                              <CreateDeviceForm />
                         </FullScreenDialog>
                         <FullScreenDialog
                              open={openEditDialog && !!selectedDevice}
                              onClose={() =>
                                   history.push({ hash: '', search: '' })
                              }
                              onExited={resetEditDeviceA}
                              heading="Editace zařízení"
                         >
                              <EditDeviceForm device={selectedDevice} />
                         </FullScreenDialog>
                         <FullScreenDialog
                              open={openSensorsDialog && !!selectedDevice}
                              onClose={() =>  history.push({ hash: '', search: '' })}
                              onExited={resetEditSensorsA}
                              heading="Editace senzorů"
                         >
                              <EditSensorsForm device={selectedDevice} />
                         </FullScreenDialog>
                         <FullScreenDialog
                              open={openControlDialog && !!selectedDevice}
                              onClose={() =>  history.push({ hash: '', search: '' })}
                              onExited={resetEditControlA}
                              heading="Editace ovládání"
                         >
                              <EditControlForm device={selectedDevice} />
                         </FullScreenDialog>
                         <FullScreenDialog
                              open={openPermissionsDialog && !!selectedDevice}
                              onClose={() => history.push({ hash: '', search: '' })}
                              onExited={resetEditPermissionsA}
                              heading="Editace oprávnění"
                         >
                              <EditPermissions device={selectedDevice} />
                         </FullScreenDialog>

                    </Fragment>
               </Fragment>
          )
     }
}

const _mapStateToProps = state => {
     const id = getQueryID(state)
     const devices = filter(isWritable, getDevices(state))
     return {
          openCreateDialog: isUrlHash('#createDevice')(state),
          openEditDialog: isUrlHash('#editDevice')(state),
          openSensorsDialog: isUrlHash('#editSensors')(state),
          openPermissionsDialog: isUrlHash('#editPermissions')(state),
          openControlDialog: isUrlHash('#editControl')(state),
          devices,
          selectedDevice: devices.find(dev => dev.id === id),
     }
}

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchDevicesAction: deviceActions.fetch,
               resetEditDeviceA: formsActions.removeForm("EDIT_DEVICE"),
               resetEditSensorsA: formsActions.removeForm("EDIT_SENSORS"),
               resetEditPermissionsA: formsActions.removeForm("EDIT_PERMISSIONS"),
               resetEditControlA: formsActions.removeForm("EDIT_CONTROL"),
               deleteDeviceAction: deviceActions.deleteDevice,
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(Devices))
