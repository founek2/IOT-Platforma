import React from 'react'
import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import { connect } from 'react-redux'

import { getFieldVal } from 'framework-ui/lib/utils/getters'
import { ControlStateTypes, NotifyControlTypes } from '../../../constants'

const styles = theme => ({
    contentInner: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        }
    }
})

function EditSensor({ id, classes, recipe = [], JSONkey, selectedJSONkey }) {
    const { type } = recipe.find(({ JSONkey: key }) => key === JSONkey)

    return <div className={classes.contentInner}>
        <FieldConnector
            component="Select"
            deepPath={`EDIT_NOTIFY_CONTROL.JSONkey.${id}`}
            selectOptions={ControlStateTypes[type].map(({ value, label }) =>
                <MenuItem value={value} key={value}>
                    {label}
                </MenuItem>)}
        />
        {selectedJSONkey && <FieldConnector
            component="Select"
            deepPath={`EDIT_NOTIFY_CONTROL.type.${id}`}
            selectOptions={NotifyControlTypes[selectedJSONkey].map(({ value, label }) => <MenuItem value={value} key={value}>
                {label}
            </MenuItem>)}
        />}
        {/* <FieldConnector
                deepPath={`EDIT_NOTIFY_CONTROL.value.${id}`}
            /> */}
    </div>
}

const _mapStateToProps = (state, { id }) => {
    return {
        selectedJSONkey: getFieldVal(`EDIT_NOTIFY_CONTROL.JSONkey.${id}`, state)
    }
}

export default connect(_mapStateToProps)(withStyles(styles)(EditSensor));