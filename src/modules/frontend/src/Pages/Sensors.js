import React, { Fragment, Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SensorBox from './sensors/SensorBox'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { filter } from 'ramda'
import { bindActionCreators } from 'redux'

import { getUserPresence, isUrlHash } from 'framework-ui/src/utils/getters'
import { getDevices } from '../utils/getters'
import * as deviceActions from '../store/actions/application/devices'
import io from '../webSocket'

function readableWithSensors(device) {
     return (device.publicRead || (device.permissions && device.permissions.read) )  && (device.sensors && device.sensors.recipe)
}

const styles = theme => ({

})

function updateDevice(updateDeviceAction) {
     return ({data, deviceID, updatedAt}) => {
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

class Sensors extends Component {
     componentDidMount() {
          this.props.fetchDevicesAction()
          this.listener =  updateDevice(this.props.updateDeviceAction)
          io.getSocket().on("sensors", this.listener)
     }

     componentWillUnmount() {
          io.getSocket().off("sensors", this.listener)
     }

     render() {
          const { classes, userPresence, openDialog, devices } = this.props;
          return (
               <Fragment>
                    {devices.map(data => (
                         <SensorBox device={data} key={data.id} />
                    ))}
               </Fragment>
          )
     }
}

const _mapStateToProps = state => ({
     userPresence: getUserPresence(state),
     openDialog: isUrlHash('#createSensor')(state),
     devices: filter(readableWithSensors, getDevices(state))
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchDevicesAction: deviceActions.fetch,
               updateDeviceAction: deviceActions.update
          },
          dispatch
	)

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Sensors))
