import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { CirclePicker } from 'react-color'
import textFieldStyles from 'framework-ui/src/Components/fieldConnector/styles'
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    colorWrap: {
        width: 196,
        margin: `${theme.spacing(2)}px auto 0`
    },
    colored: {
        height: 30,
        borderRadius: 4
    },
    textField: textFieldStyles(theme).textField,
})

function ColorPicker({ value, onChange, classes, error, FormHelperTextProps, helperText }) {
    return (
        <div>
            <div className={classes.textField}>
            <div style={{ backgroundColor: value }} className={classes.colored} />
            {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
            </div>
            <div className={classes.colorWrap}>
                <CirclePicker
                    color={value}
                    onChange={(color) => onChange({ target: { value: color.hex } })}
                    width="200"
                />
            </div>
        </div>)
}

export default withStyles(styles)(ColorPicker)