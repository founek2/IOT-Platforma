import { Grid } from '@material-ui/core';
import type { IDevice } from 'common/lib/models/interface/device';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { DeviceForm } from 'frontend/src/components/DeviceForm';
import { map } from 'ramda';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userNamesActions } from '../../store/actions/application/userNames';
import { IState } from '../../types';
import { getUserNames } from '../../utils/getters';

interface DiscoverySectionProps {
    devices?: IDevice[];
    deleteDiscoveryAction: any;
    updateFormField: any;
    userNames: IState['application']['userNames'];
}

function EditDeviceForm({ userNames }: DiscoverySectionProps) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(userNamesActions.fetch());
    }, [dispatch]);

    return (
        <>
            <DeviceForm formName="EDIT_DEVICE" />
            {userNames.data.length ? (
                <>
                    <Grid item xs={12} sm={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.read"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                            // className={classes.chipArray}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.control"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                            // className={classes.chipArray}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.write"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                            // className={classes.chipArray}
                        />
                    </Grid>
                </>
            ) : null}
        </>
    );
}

const _mapStateToProps = (state: any) => {
    return {
        userNames: getUserNames(state),
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            fetchUserNames: userNamesActions.fetch,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(EditDeviceForm as any);
