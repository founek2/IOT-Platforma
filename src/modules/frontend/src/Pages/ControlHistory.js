import React, { Fragment, useEffect, useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import { filter, fromPairs } from 'ramda'
import { bindActionCreators } from 'redux'
import { getDevices, getControl, getQueryField } from '../utils/getters'
import * as deviceActions from '../store/actions/application/devices'
import * as controlActions from '../store/actions/application/devices/control'
import Typography from '@material-ui/core/Typography';
import DetailTable from './sensorHistory/DetailTable'
import resetTime from 'framework/src/utils/resetTime'

import Chart from '../components/Chart'

function writableWithControl(device) {
    return (device.permissions && device.permissions.control) && (device.control && device.control.recipe)
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

function transformData(controlData, controlRecipe, JSONkey) {
    const arr = [["Čas"]]
    const keys = []

    const { name, type } = controlRecipe.find(({ JSONkey: key }) => key === JSONkey)
    arr[0].push(name)
    keys.push("on")

    const sumObject = {};

    // DATA for Graph
    controlData.forEach(({ samples, nsamples, timestamps, day, sum, min, max }) => {
        const len = timestamps.length
        for (let i = 0; i < len; ++i) {
            const newArr = [new Date(timestamps[i])]
            for (let j = 0; j < keys.length; j++) {
                const key = keys[j]
                if (samples[i][key]) {
                    newArr[j + 1] = Number(samples[i][key]) // on index 0 is timestamp
                } else {
                    newArr[j + 1] = null // on index 0 is timestamp
                }
            }
            arr.push(newArr)
        }


        // DATA for table
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
    console.log("output", [arr, sumObject])
    return [arr, sumObject]
}

function ControlHistory({ fetchDevicesAction, fetchControlDataAction, device, match: { params }, classes, control, JSONkey, sensorName }) {
    useEffect(() => {
        const from = new Date()
        from.setDate(from.getDate() - 7);   // Go 7 days back

        if (!device) {
            fetchDevicesAction()
            fetchControlDataAction(params.deviceId, JSONkey)(resetTime(from))
        } else fetchControlDataAction(params.deviceId, JSONkey)(resetTime(from))
    }, [])

    const hasData =
        device && control && control.id === device.id && control.data && control.data.length


    // memoize data, because it always fetches new one, even if they are same
    const [dataArray, sumObject] = useMemo(() =>
        hasData
            ? transformData(control.data, device.control.recipe, JSONkey)
            : [],
        [hasData && control.data[0].first, hasData && control.data[control.data.length - 1].last]) // check from -> to

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
                            chartType="ScatterChart"
                        /> : <Typography className={classes.noDevices}>Nebyla nalezena žádná historická data</Typography>}
                    {/* {
                        hasData && JSONkey ? <DetailTable sumObject={sumObject} sensorRecipe={device.control.recipe.find(({ JSONkey: key }) => JSONkey === key)} /> : null
                    } */}

                </Card>
                : <Typography className={classes.noDevices}>Nebylo nalezeno vámi zvolené zařízení</Typography>}
        </Fragment>
    )
}


const _mapStateToProps = (state, { match: { params } }) => {
    const devices = filter(writableWithControl, getDevices(state))
    return {
        device: devices.find(dev => dev.id === params.deviceId),
        control: getControl(state),
        JSONkey: getQueryField("JSONkey", state),
    }
}

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchDevicesAction: deviceActions.fetch,
            fetchControlDataAction: controlActions.fetchData
        },
        dispatch
    )

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(ControlHistory))
