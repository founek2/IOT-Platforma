import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevicesQuery, useUpdateDeviceMutation } from '../endpoints/devices';
import { useAppSelector } from '../hooks/index';
import { getDevice } from '../selectors/getters';
import { not } from '../utils/ramda';
import { DeviceDialogForm } from './deviceManagement/DeviceDialogForm';
import Room from './room/Room';

interface DeviceManagementProps {
    title?: string;
}
export default function DeviceManagement({ title }: DeviceManagementProps) {
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 1 * 60 * 1000 });
    const [urlSearchParams] = useSearchParams();
    const selectedDevice = useAppSelector(getDevice(urlSearchParams.get('deviceId') || ''));
    const navigate = useNavigate();
    const [updateDevice] = useUpdateDeviceMutation();

    function closeDialog() {
        navigate({ search: '' }, { replace: true });
    }
    return (
        <>
            {isLoading ? <CircularProgress /> : <Room title={title} mode="devices" />}
            <DeviceDialogForm
                title={selectedDevice?.info.name}
                open={Boolean(selectedDevice)}
                onClose={closeDialog}
                deviceToEdit={selectedDevice}
                onSave={async (data) => {
                    if (!selectedDevice) return;

                    const result = await updateDevice({ deviceID: selectedDevice._id, data });
                    if (not('error' in result)) closeDialog();
                }}
            />
        </>
    );
}
