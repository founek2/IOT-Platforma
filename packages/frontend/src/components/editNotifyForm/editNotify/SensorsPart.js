import React from 'react'
import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'

import { NotifyTypes } from 'common/lib/constants'

const styles = theme => ({
    contentInner: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        }
    },
})

function EditSensor({ id, classes, onDelete, recipe = [] }) {
    return <div className={classes.contentInner}>
        <FieldConnector
            component="Select"
            deepPath={`EDIT_NOTIFY_SENSORS.JSONkey.${id}`}
            selectOptions={recipe.map(
                ({ name, JSONkey }) =>
                    <MenuItem value={JSONkey} key={JSONkey}>
                        {name}
                    </MenuItem>)}
        />
        <FieldConnector
            component="Select"
            deepPath={`EDIT_NOTIFY_SENSORS.type.${id}`}
            selectOptions={NotifyTypes.map(
                ({ value, label }) =>
                    <MenuItem value={value} key={value}>
                        {label}
                    </MenuItem>
            )}
        />
        <FieldConnector
            deepPath={`EDIT_NOTIFY_SENSORS.value.${id}`}
        />
    </div>
}

export default withStyles(styles)(EditSensor);