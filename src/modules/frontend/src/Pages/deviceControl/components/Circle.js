import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    circle: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        display: 'inline-block',
        top: 7,
        right: 7,
        position: 'absolute',
    },
    green: {
        backgroundColor: "#62bd19",
    },
    red: {
        backgroundColor: "#cd0000",
    },
    orange: {
        backgroundColor: "#bb5109"
    }
}

function Circle({color, classes}) {
    return (<div className={`${classes.circle} ${classes[color]}`}/>)
}

export default withStyles(styles)(Circle)