import { IDevice, IDeviceStatus } from 'common/src/models/interface/device.js';
import { createContext, useContext } from 'react';

interface SimpleDevice {
    _id: IDevice['_id'];
    status?: IDeviceStatus;
    metadata: IDevice['metadata'];
}
export const DeviceContext = createContext<SimpleDevice>({} as SimpleDevice);

export function useDevice() {
    return useContext(DeviceContext);
}
