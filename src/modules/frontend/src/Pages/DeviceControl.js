import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from './deviceControl/Swich'
import Activator from './deviceControl/Activator'
import { connect } from 'react-redux'
import { getDevices } from '../utils/getters'
import { filter, isEmpty } from 'ramda'
import { bindActionCreators } from 'redux'
import * as deviceActions from '../store/actions/application/devices'
import { Typography } from '@material-ui/core'
import io from '../webSocket'
import RgbSwitch from './deviceControl/RgbSwitch'
import { ControlTypesFormNames } from '../constants'

const compMapper = {
     activator: Activator,
     switch: Switch,
     rgbSwitch: RgbSwitch,
}

function isControllable(device) {
     return device.permissions && device.permissions.control && device.control && device.control.recipe
}

const styles = theme => ({
     root: {
          display: "flex",
          flexWrap: "wrap",
     },
     item: {
          width: 150,
          [theme.breakpoints.down('sm')]: {
               width: `calc(50% - ${theme.spacing(1.5)}px)`,     // to add spacing to right
               margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`
          }
     }
})

function updateDevice(updateDeviceAction) {
     return ({ data, deviceID, updatedAt }) => {
          console.log("web socket GOT")
          const updateObj = {
               id: deviceID,
               ack: updatedAt,
          };
          if (data) updateObj.control = { current: { data } }

          updateDeviceAction(updateObj)
     }
}


function deviceControl({ classes, devices, fetchDevicesAction, updateDeviceStateA, updateDeviceAction, fetchControlAction }) {
     useEffect(() => {
          fetchDevicesAction()
          // fetchControlAction()
          const listener = updateDevice(updateDeviceAction)
          io.getSocket().on("control", listener)

          const listenerAck = updateDevice(updateDeviceAction)
          io.getSocket().on("ack", listenerAck)

          window.addEventListener('focus', fetchControlAction)

          return () => {
               io.getSocket().off("control", listener)
               io.getSocket().off("ack", listenerAck)
               window.removeEventListener('focus', fetchControlAction)
          };
     }, []);

     const arr = [];
     devices.forEach(device => {
          device.control.recipe.forEach(({ name, type, JSONkey, description }) => {

               const Comp = compMapper[type]
               const data = (device.control.current && device.control.current.data[JSONkey] && device.control.current.data[JSONkey]) || {}
               arr.push(<Comp
                    key={`${device.id}/${JSONkey}`}
                    name={name}
                    description={description}
                    onClick={(val) => updateDeviceStateA(device.id, JSONkey, val, ControlTypesFormNames[type])}
                    data={data}
                    className={classes.item}
                    ackTime={device.ack}
                    updateTime={device.ack}     // to force updating
               />)
          })
     })


     return <div className={classes.root}>
          {isEmpty(arr) ? <Typography>Nebyla nalezena žádná zařízení</Typography> : arr}
     </div>
}

const _mapStateToProps = state => ({
     devices: filter(isControllable, getDevices(state))
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchDevicesAction: deviceActions.fetch,
               updateDeviceStateA: deviceActions.updateState,
               updateDeviceAction: deviceActions.update,
               fetchControlAction: deviceActions.fetchControl,
          },
          dispatch
     )

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(deviceControl))
