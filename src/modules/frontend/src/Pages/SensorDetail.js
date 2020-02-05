import React, { Fragment, Component, useEffect, useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import { filter, curry, merge, fromPairs } from 'ramda'
import { bindActionCreators } from 'redux'
import { getDevices, getSensors, getQueryName } from '../utils/getters'
import * as deviceActions from '../store/actions/application/devices'
import * as sensorsActions from '../store/actions/application/sensors'
import Typography from '@material-ui/core/Typography';
import Chart from './sensorDetail/Chart'
import DetailTable from './sensorDetail/DetailTable'
import resetTime from 'framework/src/utils/resetTime'

function readableWithSensors(device) {
    return (device.publicRead || (device.permissions && device.permissions.read)) && (device.sensors && device.sensors.recipe)
}

const styles = theme => ({
    noDevices: {
        padding: 10
    },
    title: {
        padding: 15,
        color: "#5c6b73"
    },
    root: {
        paddingBottom: 20
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

function transformData(sensorsData, sensorRecipe, sensorName) {
    const arr = [["Čas"]]
    const keys = []
    if (sensorName) {   // Only data from specific sensor
        const { name, JSONkey, unit } = sensorRecipe.find(({ name }) => name === sensorName)
        arr[0].push(name)
        keys.push(JSONkey)
    } else { // all sensors
        sensorRecipe.forEach(({ name, JSONkey, unit }) => {
            arr[0].push(name + " " + unit)
            keys.push(JSONkey)
        })
    }

    const sumObject = {};
    sensorsData.forEach(({ samples, nsamples, timestamps, day, sum, min, max }) => {
        const len = (nsamples.day || 0) + (nsamples.night || 0)
        for (let i = 0; i < len; ++i) {
            const newArr = [new Date(timestamps[i])]
            for (let j = 0; j < keys.length; j++) {
                const key = keys[j]
                if (samples[key]) {
                    newArr[j + 1] = Number(samples[key][i]) // on index 0 is timestamp
                } else {
                    newArr[j + 1] = null // on index 0 is timestamp
                }
            }
            arr.push(newArr)
        }

        const zeroObj = fromPairs(keys.map(k => [k, 0]))
        const nullObj = fromPairs(keys.map(k => [k, null]))
        if (!sumObject[day]) sumObject[day] = { sum: { day: { ...zeroObj }, night: { ...zeroObj } }, nsamples: { day: 0, night: 0 }, min: { ...nullObj }, max: { ...nullObj } }

        const oneDay = sumObject[day]
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j]

            if (sum.day)
                oneDay.sum.day[key] += sum.day[key]

            if (sum.night)
                oneDay.sum.night[key] += sum.night[key]

            // null is for non recoreded values
            if (oneDay.min[key] === null || oneDay.min[key] > min[key]) oneDay.min[key] = min[key]
            if (oneDay.max[key] === null || oneDay.max[key] < max[key]) oneDay.max[key] = max[key]
        }
        oneDay.nsamples.night += nsamples.night || 0
        oneDay.nsamples.day += nsamples.day || 0
    })
    return [arr, sumObject]
}

function Sensors({ fetchDevicesAction, fetchSensorsDataAction, device, match: { params }, classes, sensors, sensorName }) {
    useEffect(() => {
        const from = new Date()
        from.setDate(from.getDate() - 7);   // Go 7 days back

        if (!device) {
            fetchDevicesAction()
            fetchSensorsDataAction(params.deviceId)(resetTime(from))
        } else fetchSensorsDataAction(params.deviceId)(resetTime(from))
    }, [])

    const hasData =
        device && sensors && sensors.id == device.id && sensors.data &&
        (
            sensors.data.length >= 2
            || (
                sensors.data.length == 1
                && (sensors.data[0].nsamples.day || 0) + (sensors.data[0].nsamples.night || 0) >= 2
            )
        )
    // memoize data, because it always fetches new one, even if they are same
    const [dataArray, sumObject] = useMemo(() =>
        hasData
            ? transformData(sensors.data, device.sensors.recipe, sensorName)
            : [],
        [hasData && sensors.data[0].first, hasData && sensors.data[sensors.data.length - 1].last]) // check from -> to

    return (
        <Fragment>
            {device
                ? <Card className={classes.root}>
                    <Typography className={classes.title} variant="h3" align="center">{device.title}</Typography>
                    {hasData ? // Chart needs two points to draw a line
                        <Chart
                            data={dataArray}
                            vAxisTitle={sensorName ? device.sensors.recipe.find(({ name }) => name === sensorName).unit : ""}
                            hAxisTitle="Čas"
                        /> : <Typography className={classes.noDevices}>Nebyla nalezena žádná historická data</Typography>}
                    {
                        hasData && sensorName ? <DetailTable sumObject={sumObject} sensorRecipe={device.sensors.recipe.find(({ name }) => name === sensorName)} /> : null
                    }
                    {
                        hasData && !sensorName ? device.sensors.recipe.map(obj => <DetailTable sumObject={sumObject} sensorRecipe={obj} key={obj.JSONkey} />) : null
                    }

                </Card>
                : <Typography className={classes.noDevices}>Nebylo nalezeno vámi zvolené zařízení</Typography>}
        </Fragment>
    )
}


const _mapStateToProps = (state, { match: { params } }) => {
    const devices = filter(readableWithSensors, getDevices(state))
    return {
        device: devices.find(dev => dev.id === params.deviceId),
        sensors: getSensors(state),
        sensorName: getQueryName(state),
    }
}

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchDevicesAction: deviceActions.fetch,
            fetchSensorsDataAction: sensorsActions.fetchData
        },
        dispatch
    )

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Sensors))
