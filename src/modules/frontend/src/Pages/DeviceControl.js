import React, { Fragment, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Switch from './deviceControl/Swich'
import Activator from './deviceControl/Activator'
import { connect } from 'react-redux'
import { getDevices } from '../utils/getters'
import { filter, isEmpty } from 'ramda'
import { bindActionCreators } from 'redux'
import * as deviceActions from '../store/actions/application/devices'
import { Typography } from '@material-ui/core'

const compMapper = {
     activator: Activator,
     switch: Switch,
}

function isControllable(device) {
     return device.permissions && device.permissions.control && device.control && device.control.recipe
}

const styles = theme => ({
     root: {
          // height: "100vh"
          // paddingBottom: "100px"
          display: "flex"
     },
     item: {
          width: 150,
          [theme.breakpoints.down('sm')]: {
               width: `calc(50% - ${theme.spacing(1.5)}px)`,     // to add spacing to right
               margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`
          }
     }
})


function deviceControl({ classes, devices, fetchDevicesAction, updateDeviceStateA }) {
     useEffect(() => { fetchDevicesAction() }, [])
     const arr = [];
     devices.forEach(device => {
          device.control.recipe.forEach(({ name, type, JSONkey, description }) => {
               // console.log("name", name, type, compMapper[type])
               const Comp = compMapper[type]
               const value = (device.control.current && device.control.current.data[JSONkey] && device.control.current.data[JSONkey].state) || 0
               arr.push(<Comp
                    key={`${device.id}/${JSONkey}`}
                    name={name}
                    description={description}
                    onClick={(val) => updateDeviceStateA(device.id, JSONkey, val)}
                    value={value}
                    className={classes.item}
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
          },
          dispatch
     )

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(deviceControl))
