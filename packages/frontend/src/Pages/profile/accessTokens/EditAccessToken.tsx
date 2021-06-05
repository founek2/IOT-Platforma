import { Grid, MenuItem } from '@material-ui/core';
import type { IDevice } from 'common/lib/models/interface/device';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import * as formsActions from 'framework-ui/lib/redux/actions/formsData';
import { DeviceForm } from 'frontend/src/components/DeviceForm';
import { map, pick, lensProp, over, o } from 'ramda';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { IAccessToken } from 'common/lib/models/interface/userInterface';
import { TokenPermissions } from 'frontend/src/constants';

interface DiscoverySectionProps {
    formName: string;
    fillForm: any;
    accessToken?: IAccessToken;
}

const permToStr = over(lensProp('permissions'), (arr: Array<any>) => arr.toString());

function EditDeviceForm({ formName, fillForm, accessToken }: DiscoverySectionProps) {
    useEffect(() => {
        if (accessToken) {
            compose(fillForm, pick(['name', 'permissions']))(accessToken);
        }
    }, [accessToken]);

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

const _mapStateToProps = (state: any) => {
    return {};
};

const _mapDispatchToProps = (dispatch: any, props: any) =>
    bindActionCreators(
        {
            fillForm: formsActions.fillForm(props.formName),
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(EditDeviceForm as any);
