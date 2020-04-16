import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'
import getCircleColor from '../utils/getCircleColor'

const styles = {
    wrapper: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        display: 'inline-block',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        marginLeft: 6,
        marginTop: 6,
    },
    green: {
        backgroundColor: "#62bd19",
    },
    red: {
        backgroundColor: "#cd0000",
    },
    orange: {
        backgroundColor: "#e08d0f"
    }
}

const CircleComponent = React.forwardRef(
    function ({ color, classes, className, ...props }, ref) {
        return (
            <div {...props} ref={ref} className={`${classes.wrapper} ${className ? className : ""}`}>
                <div className={`${classes.circle} ${classes[color]}`} />
            </div>)
    }
)

const Circle = React.forwardRef(function ({ classes, ackTime, changeTime, afk, className, inTransition }, ref) {
    const time = afk ? new Date(ackTime) : new Date(changeTime)
    const invalidTime = time == "Invalid Date";

    const [textOnline] = getLastUpdateText(new Date(ackTime), "Aktivní před", "Nyní aktivní")
    const [textChange] = getLastUpdateText(new Date(changeTime), "Poslední změna před", "Právě změněno")

    const title = invalidTime
        ? afk ? "Zařízení nikdy nebylo připojeno" : "Poslední změna nikdy"
        : afk ? textOnline : textChange;
    return (
        <Tooltip title={inTransition ? "Čeká na potvrzení" : title} placement="bottom" arrow={true}>
            <CircleComponent color={getCircleColor(inTransition, ackTime)} classes={classes} className={className} ref={ref}/>
        </Tooltip>)

})

export default withStyles(styles)(Circle)