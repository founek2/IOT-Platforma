import React, { Fragment, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SensorBox from './sensors/SensorBox'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { filter } from 'ramda'
import { bindActionCreators } from 'redux'
import { isNotEmpty } from 'ramda-extension'

import { getUserPresence, isUrlHash } from 'framework-ui/src/utils/getters'
import { getDevices } from '../utils/getters'
import * as deviceActions from '../store/actions/application/devices'
import io from '../webSocket'
import { Typography } from '@material-ui/core';


function readableWithSensors(device) {
     return (device.publicRead || (device.permissions && device.permissions.read)) && (device.sensors && device.sensors.recipe)
}

const styles = theme => ({
     noDevices: {
          padding: 10
     }
})

function updateDevice(updateDeviceAction) {
     return ({ data, deviceID, updatedAt }) => {
          updateDeviceAction({
               id: deviceID,
               sensors: {
                    current: {
                         data,
                         updatedAt
                    }
               }
          })
     }
}

// TODO stáhnout nová data, pokud na event focus budou starší jak cca 30min?
function Sensors({ fetchDevicesAction,updateDeviceAction, devices, classes, updateSensorsAction }) {
     useEffect(() => {
          fetchDevicesAction()
          const listener = updateDevice(updateDeviceAction)
          io.getSocket().on("sensors", listener)

          window.addEventListener('focus', updateSensorsAction)

          return () => {
               io.getSocket().off("control", listener)
               window.removeEventListener('focus', updateSensorsAction)
          };
     }, [])

     return (
          <Fragment>
               {isNotEmpty(devices)
                    ? devices.map(data => (
                         <SensorBox device={data} key={data.id} />
                    ))
                    : <Typography className={classes.noDevices}>Nebyla nalezena žádná zařízení s naměřenými daty</Typography>}
          </Fragment>
     )
}


const _mapStateToProps = state => ({
     devices: filter(readableWithSensors, getDevices(state))
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchDevicesAction: deviceActions.fetch,
               updateDeviceAction: deviceActions.update,
               updateSensorsAction: deviceActions.fetchSensors,
          },
          dispatch
     )

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Sensors))
