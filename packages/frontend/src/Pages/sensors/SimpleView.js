import React, { Fragment } from "react"
import { getDevices, getSensors, getQueryName } from '../../utils/getters'
import { filter, map } from "ramda"
import { withStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { Link } from 'react-router-dom'
import toDateTime from '../../utils/toDateTime'
import UpdatedBefore from 'framework-ui/lib/Components/UpdatedBefore'
import clsx from "clsx"
import grey from '@material-ui/core/colors/grey';

function readableWithSensors(device) {
    return (device.publicRead || (device.permissions && device.permissions.read)) && (device.sensors && device.sensors.recipe)
}

// TODO duplicit
function convertDataView(classes, currentData, id) {
    return ({ name, unit, JSONkey, description }) => {


        return (
            <Fragment>
                <Typography className={classes.variable}>
                    {name}
                </Typography>
                <Typography className={classes.data} color="primary">
                    {currentData && currentData[JSONkey] !== undefined ? currentData[JSONkey] : "***"} {unit}
                </Typography>
            </Fragment>
        )
    }
}

const styles = {
    container: {
        position: "relative",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        marginTop: 20
    },
    dataContainer: {
        textAlign: "center"
    },
    data: {
        fontSize: "22vw"
    },
    variable: {
        fontSize: "2rem",
        color: grey[500]
    },
    updatedBefore: {
        position: "absolute",
        right: 50,
        bottom: 0
    }
}
// device.sensors.current.data
function SimpleView({ device, classes }) {
    if (!device) return null;

    const { sensors } = device;
    const time = sensors.current ? new Date(sensors.current.updatedAt) : null;

    return <div class={classes.container}>

        <div className={classes.dataContainer}>
            {map(convertDataView(classes, sensors.current.data, device.id), sensors.recipe)}
        </div>
        <Tooltip title={toDateTime(time)} placement="bottom" arrow={true}>
            <UpdatedBefore updateTime={time} time={time} className={classes.updatedBefore} />
        </Tooltip>

    </div>
}


export default withStyles(styles)(SimpleView)
