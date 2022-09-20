import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import { DeviceForm } from 'frontend/src/components/DeviceForm';
import { locationsSelector } from 'frontend/src/store/selectors/deviceSelector';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/hooks';
import { userNamesActions } from '../../store/actions/application/userNames';
import { getUserNames } from '../../utils/getters';
import PermissionSelect from './editDeviceForm/PermissionSelect';

function EditDeviceForm() {
    const locations = useAppSelector(locationsSelector);
    const userNames = useAppSelector(getUserNames);
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

export default EditDeviceForm;
