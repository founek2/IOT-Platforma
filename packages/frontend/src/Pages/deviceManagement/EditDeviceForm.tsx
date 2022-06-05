import type { IDevice } from 'common/lib/models/interface/device';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { DeviceForm } from 'frontend/src/components/DeviceForm';
import { locationsSelector } from 'frontend/src/store/selectors/deviceSelector';
import { RootState } from 'frontend/src/store/store';
import { Locations } from 'frontend/src/types';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userNamesActions } from '../../store/actions/application/userNames';
import { getUserNames } from '../../utils/getters';
import PermissionSelect from './editDeviceForm/PermissionSelect';

interface DiscoverySectionProps {
    devices?: IDevice[];
    deleteDiscoveryAction: any;
    updateFormField: any;
    userNames: RootState['application']['userNames'];
    locations: Locations;
}

function EditDeviceForm({ userNames, locations }: DiscoverySectionProps) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(userNamesActions.fetch());
    }, [dispatch]);

    return (
        <>
            <DeviceForm formName="EDIT_DEVICE" locations={locations} />
            {userNames.data.length ? (
                <FieldConnector
                    deepPath="EDIT_DEVICE.permissions"
                    component={({ label, error, value, onChange }) => (
                        <PermissionSelect label={label} error={error} permissions={value} onChange={onChange} />
                    )}
                />
            ) : null}
        </>
    );
}

const _mapStateToProps = (state: any) => {
    return {
        locations: locationsSelector(state),
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
