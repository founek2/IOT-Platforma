import React, { Fragment } from 'react';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';

import { getFieldVal } from 'framework-ui/lib/utils/getters';
import { ControlStateTypes, NotifyControlTypes } from '../../../constants';

const styles = (theme) => ({});

function EditSensor({ id, classes, recipe = [], JSONkey, selectedJSONkey }) {
    const { type } = recipe.find(({ JSONkey: key }) => key === JSONkey);

    return (
        <Fragment>
            <Grid item md={4} xs={12}>
                <FieldConnector
                    component="Select"
                    deepPath={`EDIT_NOTIFY_CONTROL.JSONkey.${id}`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                    selectOptions={ControlStateTypes[type].map(({ value, label }) => (
                        <MenuItem value={value} key={value}>
                            {label}
                        </MenuItem>
                    ))}
                />
            </Grid>
            {selectedJSONkey && (
                <Grid item md={4} xs={12}>
                    <FieldConnector
                        component="Select"
                        deepPath={`EDIT_NOTIFY_CONTROL.type.${id}`}
                        fieldProps={{
                            fullWidth: true,
                        }}
                        selectOptions={NotifyControlTypes[selectedJSONkey].map(({ value, label }) => (
                            <MenuItem value={value} key={value}>
                                {label}
                            </MenuItem>
                        ))}
                    />
                </Grid>
            )}
            {/* <FieldConnector
                deepPath={`EDIT_NOTIFY_CONTROL.value.${id}`}
            /> */}
        </Fragment>
    );
}

const _mapStateToProps = (state, { id }) => {
    return {
        selectedJSONkey: getFieldVal(`EDIT_NOTIFY_CONTROL.JSONkey.${id}`, state),
    };
};

export default connect(_mapStateToProps)(withStyles(styles)(EditSensor));
