import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import React from 'react'
import { ControlTypes, CONTROL_TYPES } from "common/lib/constants"
import { getFieldVal, getFormData } from 'framework-ui/lib/utils/getters'
import { useSelector } from 'react-redux'

const styles = (theme: Theme) => createStyles({
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

interface EditSensorProps {
    id: number
    classes: any
    onDelete: (id: number, e: any) => void
}
function EditSensor({ id, classes, onDelete }: EditSensorProps) {
    const selectedType: undefined | string = useSelector((state) => {
        const arr: string[] | undefined = getFieldVal("EDIT_CONTROL.type")(state) as any
        // console.log("arr", arr)
        return arr && arr[id]
    })

    return (<div className={classes.quantity} key={id}>
        <FormLabel component="legend">Prvek {id + 1}:</FormLabel>
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
                deepPath={`EDIT_CONTROL.name.${id}`}
            />
            <FieldConnector
                component="Select"
                deepPath={`EDIT_CONTROL.type.${id}`}
                selectOptions={ControlTypes
                    .map(
                        ({ value, label }) =>
                        (<MenuItem value={value} key={value}>
                            {label}
                        </MenuItem>)
                    )}
            />
            <FieldConnector
                component="TextField"
                fieldProps={{
                    type: 'text',
                    className: classes.unit
                }}
                deepPath={`EDIT_CONTROL.JSONkey.${id}`}
            />
        </div>
        <FieldConnector
            component="TextField"
            fieldProps={{
                type: 'text',
                className: classes.textArea,
                multiline: true
            }}
            deepPath={`EDIT_CONTROL.description.${id}`}
        />
        {selectedType === CONTROL_TYPES.MUSIC_CAST && <FieldConnector
            fieldProps={{
                className: classes.textArea,
            }}
            deepPath={`EDIT_CONTROL.ipAddress.${id}`}
        />}

    </div>)
}

export default withStyles(styles)(EditSensor);