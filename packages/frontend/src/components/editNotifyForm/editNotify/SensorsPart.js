import React, { Fragment } from 'react';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import { NotifyTypes } from 'common/lib/constants';

const styles = (theme) => ({
    // contentInner: {
    //     display: 'flex',
    //     [theme.breakpoints.down('sm')]: {
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //     }
    // },
});

function EditSensor({ id, classes, onDelete, recipe = [] }) {
    return (
        <Fragment>
            <Grid item md={4} xs={12}>
                <FieldConnector
                    component="Select"
                    deepPath={`EDIT_NOTIFY_SENSORS.JSONkey.${id}`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                    selectOptions={recipe.map(({ name, JSONkey }) => (
                        <MenuItem value={JSONkey} key={JSONkey}>
                            {name}
                        </MenuItem>
                    ))}
                />
            </Grid>
            <Grid item md={4} xs={12}>
                <FieldConnector
                    component="Select"
                    deepPath={`EDIT_NOTIFY_SENSORS.type.${id}`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                    selectOptions={NotifyTypes.map(({ value, label }) => (
                        <MenuItem value={value} key={value}>
                            {label}
                        </MenuItem>
                    ))}
                />
            </Grid>
            <Grid item md={4} xs={12}>
                <FieldConnector deepPath={`EDIT_NOTIFY_SENSORS.value.${id}`} />
            </Grid>
        </Fragment>
    );
}

export default withStyles(styles)(EditSensor);
