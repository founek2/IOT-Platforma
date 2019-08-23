import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core'
import styles from './styles'

function MyTextField({ classes, className, ...props }) {
     return <TextField className={`${classes.textField} ${className || ""}`} {...props} />
}

export default withStyles(styles)(MyTextField)
