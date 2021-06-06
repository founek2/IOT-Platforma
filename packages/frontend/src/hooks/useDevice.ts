import { createContext, useContext } from 'react';
import { IDevice, DeviceStatus, IDeviceStatus } from 'common/lib/models/interface/device';

interface SimpleDevice {
    _id: IDevice['_id'];
    status?: IDeviceStatus;
}
export const DeviceContext = createContext<SimpleDevice>({} as SimpleDevice);

export function useDevice() {
    return useContext(DeviceContext);
}
