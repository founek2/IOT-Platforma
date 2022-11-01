import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../components/Dialog';
import { useAppSelector } from '../hooks/index';
import { getDevice } from '../selectors/getters';
import { DeviceForm } from './deviceManagement/DeviceForm';
import Room from './room/Room';

interface DeviceManagementProps {
    title?: string;
}
export default function DeviceManagement({ title }: DeviceManagementProps) {
    const [urlSearchParams] = useSearchParams();
    const device = useAppSelector(getDevice(urlSearchParams.get('deviceId') || ''));
    const navigate = useNavigate();

    return (
        <>
            <Room title={title} mode="devices" />
            <Dialog
                title={device?.info.name}
                open={Boolean(device)}
                onClose={() => navigate({ search: '' }, { replace: true })}
            >
                <DeviceForm formName="EDIT_DEVICE" />
            </Dialog>
        </>
    );
}
