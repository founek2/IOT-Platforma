import React, { useState } from 'react'
import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'

import { getFieldVal } from 'framework-ui/src/utils/getters'
import DaysOfWeekPicker from './DaysOfWeekPicker'
import { NotifyIntervals } from '../../constants'
import ControlPart from './editNotify/ControlPart'
import SensorsPart from './editNotify/SensorsPart'

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
    advanced: {
        textAlign: "center",
        fontSize: 12,
        cursor: "pointer",
        marginTop: 8,
        userSelect: "none",
    },
    daysPicker: {
        width: 350
    },
    containerPicker: {
        display: "flex",
        justifyContent: "center"
    }
})

function EditSensor({ id, classes, onDelete, recipe = [], editedAdvanced, formName, JSONkey }) {
    const [openAdvanced, setOpen] = useState(false)
    const sensorMode = formName === "EDIT_NOTIFY_SENSORS"
    const props = { JSONkey, id, recipe }

    return (<div className={classes.quantity} key={id}>
        <FormLabel component="legend">Notifikace {id}:</FormLabel>
        <IconButton className={classes.clearButton} aria-label="Delete a sensor" onClick={e => onDelete(id, e)}>
            <ClearIcon />
        </IconButton>
        {sensorMode ? <SensorsPart {...props} /> : <ControlPart {...props} />}
        <FieldConnector
            fieldProps={{
                type: 'text',
                className: classes.textArea,
                multiline: true
            }}
            deepPath={`${formName}.description.${id}`}
        />
        <Typography
            className={classes.advanced}
            color="primary"
            onClick={() => setOpen(!openAdvanced)}
        >Rozšířené {editedAdvanced && "⭣"}
        </Typography>
        {openAdvanced && <div>
            <div className={classes.contentInner}>
                <FieldConnector
                    component="Select"
                    deepPath={`${formName}.advanced.interval.${id}`}
                    selectOptions={
                        NotifyIntervals.map(
                            ({ value, label }) =>
                                <MenuItem value={value} key={value}>
                                    {label}
                                </MenuItem>
                        )}
                />
                <FieldConnector
                    deepPath={`${formName}.advanced.from.${id}`}
                    component="TimePicker"
                    fieldProps={{
                        defaultValue: "00:00"
                    }}
                />
                <FieldConnector
                    deepPath={`${formName}.advanced.to.${id}`}
                    component="TimePicker"
                    fieldProps={{
                        defaultValue: "23:59"
                    }}
                />
            </div>
            <div className={classes.containerPicker}>
                <div className={classes.daysPicker}>
                    <FieldConnector
                        deepPath={`${formName}.advanced.daysOfWeek.${id}`}
                        component={DaysOfWeekPicker}
                    />
                </div>
            </div>
        </div>

        }
    </div>)
}

const _mapStateToProps = (state, { id, formName }) => {
    const days = getFieldVal(`${formName}.advanced.daysOfWeek.${id}`, state)
    const editedAdvanced = getFieldVal(`${formName}.advanced.to.${id}`, state) ||
        getFieldVal(`${formName}.advanced.from.${id}`, state) ||
        (days && days.length < 7)
    console.log("len", days.length)
    return {
        editedAdvanced: !!editedAdvanced,
    }
}

export default connect(_mapStateToProps)(withStyles(styles)(EditSensor));