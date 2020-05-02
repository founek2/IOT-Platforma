import React from 'react'
import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'

import {NotifyTypes} from '../../../constants'

const styles = theme => ({
    contentInner: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        }
    },
    quantity: {
        marginTop: 30,
        position: "relative"
    },
    clearButton: {
        position: "absolute",
        right: 10,
        top: -15,
    },
    textArea: {
        // width: 'calc(100% - 16px)',
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${theme.spacing(2)}px)`
        }
    },
})

const FORM_NAME = "EDIT_NOTIFY_SENSORS"

function EditSensor({ id, classes, onDelete, recipe = [] }) {

    return (<div className={classes.quantity} key={id}>
        <FormLabel component="legend">Notifikace {id}:</FormLabel>
        <IconButton className={classes.clearButton} aria-label="Delete a sensor" onClick={e => onDelete(id, e)}>
            <ClearIcon />
        </IconButton>
        <div className={classes.contentInner}>
            <FieldConnector
                component="Select"
                deepPath={`${FORM_NAME}.JSONkey.${id}`}
                selectOptions={
                    recipe.map(
                        ({ name, JSONkey }) =>
                            <MenuItem value={JSONkey} key={JSONkey}>
                                {name}
                            </MenuItem>
                    )}
            />
            {/* <FieldConnector // in FUTURE - now just strict preffiled
                component="TextField"
                // fieldProps={{
                //     className: classes.unit
                // }}
                deepPath={`${FORM_NAME}.type.${id}`}
            /> */}
            <FieldConnector
                // fieldProps={{
                //     className: classes.unit
                // }}
                deepPath={`${FORM_NAME}.value.${id}`}
            />

            <FieldConnector
                component="Select"
                deepPath={`${FORM_NAME}.type.${id}`}
                selectOptions={
                    NotifyTypes.map(
                        ({ value, label }) =>
                            <MenuItem value={value} key={value}>
                                {label}
                            </MenuItem>
                    )}
            />
        </div>
        <FieldConnector
            component="TextField"
            fieldProps={{
                type: 'text',
                className: classes.textArea,
                multiline: true
            }}
            deepPath={`${FORM_NAME}.description.${id}`}
        />
    </div>)
}

export default withStyles(styles)(EditSensor);