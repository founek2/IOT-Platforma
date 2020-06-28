import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { CirclePicker } from 'react-color'
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    colorWrap: {
        width: 196,
        margin: `${theme.spacing(2)}px auto 16px`,
    },
    colored: {
        height: 30,
        borderRadius: 4
    },
    textField: {
        marginTop: theme.spacing(1),
        width: 200,
        [theme.breakpoints.down('sm')]: {
            width: "100%"
        }
    }
})

function ColorPicker({ value, onChange, classes, error, FormHelperTextProps, helperText, ...other }) {
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
                    style={{ marginBottom: 0 }}
                    {...other}
                />
            </div>
        </div>)
}

export default withStyles(styles)(ColorPicker)