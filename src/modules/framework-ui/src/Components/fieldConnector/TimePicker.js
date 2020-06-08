import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core'
import styles from './styles'

function TimePicker({ classes, className, defaultValue, value, ...props }) {
    return <TextField className={`${classes.textField} ${className || ""}`} {...props} type="time" value={value || defaultValue} />
}

export default withStyles(styles)(TimePicker)
