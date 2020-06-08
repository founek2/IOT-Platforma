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
import { NotifyTypes, NotifyIntervals } from '../../../constants'

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
        maxWidth: 350
    }
})

const FORM_NAME = "EDIT_NOTIFY_SENSORS"

function EditSensor({ id, classes, onDelete, recipe = [], onTypeChange, editedAdvanced }) {
    const [openAdvanced, setOpen] = useState(false)
    console.log("advancedValue", editedAdvanced)
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
                onChange={onTypeChange}
            />
            <FieldConnector
                deepPath={`${FORM_NAME}.value.${id}`}
            />
        </div>
        <FieldConnector
            fieldProps={{
                type: 'text',
                className: classes.textArea,
                multiline: true
            }}
            deepPath={`${FORM_NAME}.description.${id}`}
        />
        <Typography
            className={classes.advanced}
            color="primary"
            onClick={() => setOpen(!openAdvanced)}
        >Rozšířené {editedAdvanced && "⭣"}
        </Typography>
        {/* TODO přidat nějakou signalizaci že advanced je upravené */}
        {openAdvanced && <div>
            <div className={classes.contentInner}>
                <FieldConnector
                    component="Select"
                    deepPath={`${FORM_NAME}.advanced.interval.${id}`}
                    selectOptions={
                        NotifyIntervals.map(
                            ({ value, label }) =>
                                <MenuItem value={value} key={value}>
                                    {label}
                                </MenuItem>
                        )}
                />
                <FieldConnector
                    deepPath={`${FORM_NAME}.advanced.from.${id}`}
                    component="TimePicker"
                    fieldProps={{
                        defaultValue: "00:00"
                    }}
                />
                <FieldConnector
                    deepPath={`${FORM_NAME}.advanced.to.${id}`}
                    component="TimePicker"
                    fieldProps={{
                        defaultValue: "23:59"
                    }}
                />
            </div>
            <div className={classes.daysPicker}>
                <FieldConnector
                    deepPath={`${FORM_NAME}.advanced.daysOfWeek.${id}`}
                    component={DaysOfWeekPicker}
                />
            </div>
        </div>

        }
    </div>)
}

const _mapStateToProps = (state, { id }) => {
    const editedAdvanced = getFieldVal(`EDIT_NOTIFY_SENSORS.advanced.to.${id}`, state) ||
        getFieldVal(`EDIT_NOTIFY_SENSORS.advanced.from.${id}`, state) ||
        getFieldVal(`EDIT_NOTIFY_SENSORS.advanced.daysOfWeek.${id}`, state)
    return { editedAdvanced: !!editedAdvanced }
}

export default connect(_mapStateToProps)(withStyles(styles)(EditSensor));