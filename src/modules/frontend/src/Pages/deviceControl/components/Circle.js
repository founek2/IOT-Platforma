import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const styles = {
    wrapper: {
        width: 18,
        height: 18,
        borderRadius: "50%",
        display: 'inline-block',
        top: 5,
        right: 5,
        position: 'absolute',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        left: 4,
        top: 4,
        position: 'absolute',
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
    function ({ color, classes, ...props }, ref) {
        return (
            <div {...props} ref={ref} className={classes.wrapper}>
                <div className={`${classes.circle} ${classes[color]}`} />
            </div>)
    }
)

function Circle({ color, classes, tooltipText }) {
    return (
        <Tooltip title={tooltipText} arrow={true} placement="bottom">
            <CircleComponent color={color} classes={classes} />
        </Tooltip>)
}

export default withStyles(styles)(Circle)