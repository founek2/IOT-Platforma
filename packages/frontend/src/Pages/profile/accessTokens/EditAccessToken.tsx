import { Grid, MenuItem } from '@material-ui/core';
import { IAccessToken } from 'common/lib/models/interface/userInterface';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { TokenPermissions } from 'frontend/src/constants';
import { lensProp, over, pick } from 'ramda';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';

interface DiscoverySectionProps {
    formName: string;
    accessToken?: IAccessToken;
}

function EditDeviceForm({ formName, accessToken }: DiscoverySectionProps) {
    const dispatch = useDispatch();

    useEffect(() => {
        function fillForm(data: any) {
            dispatch(formsDataActions.setFormData({ formName, data }));
        }
        if (accessToken) compose(fillForm, pick(['name', 'permissions']))(accessToken);
    }, [accessToken, dispatch, formName]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FieldConnector
                    fieldProps={{ fullWidth: true }}
                    deepPath={`${formName}.name`}
                // className={classes.chipArray}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FieldConnector
                    fieldProps={{ fullWidth: true }}
                    deepPath={`${formName}.permissions`}
                    component="Select"
                    selectOptions={TokenPermissions.map(({ value, label }) => (
                        <MenuItem value={value} key={label}>
                            {label}
                        </MenuItem>
                    ))}
                // optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                // className={classes.chipArray}
                />
            </Grid>
        </Grid>
    );
}

export default EditDeviceForm;
