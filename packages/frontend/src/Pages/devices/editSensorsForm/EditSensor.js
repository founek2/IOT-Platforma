import React from 'react'
import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'


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

function EditSensor({ id, classes, onDelete }) {

    return (<div className={classes.quantity} key={id}>
        <FormLabel component="legend">Veličina {id}:</FormLabel>
        <IconButton className={classes.clearButton} aria-label="Delete a sensor" onClick={e => onDelete(id, e)}>
            <ClearIcon />
        </IconButton>
        <div className={classes.contentInner}>
            <FieldConnector
                component="TextField"
                fieldProps={{
                    type: 'text',
                    className: classes.textField
                }}
                deepPath={`EDIT_SENSORS.name.${id}`}
            />
            <FieldConnector
                component="TextField"
                fieldProps={{
                    type: 'text',
                    className: classes.unit
                }}
                deepPath={`EDIT_SENSORS.unit.${id}`}
            />
            <FieldConnector
                component="TextField"
                fieldProps={{
                    type: 'text',
                    className: classes.unit
                }}
                deepPath={`EDIT_SENSORS.JSONkey.${id}`}
            />
        </div>
        <FieldConnector
            component="TextField"
            fieldProps={{
                type: 'text',
                className: classes.textArea,
                multiline: true
            }}
            deepPath={`EDIT_SENSORS.description.${id}`}
        />
    </div>)
}

export default withStyles(styles)(EditSensor);