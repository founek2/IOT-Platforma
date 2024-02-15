import { DeviceCommand, IDevice } from 'common/src/models/interface/device';
import { Measurement } from 'common/src/types';
import { Device } from '../store/slices/application/devicesSlice';
import { api } from './api';

export interface EditDeviceFormData {
    info: Device['info'];
    permissions: Device['permissions'];
}
export const devicesApi = api.injectEndpoints({
    endpoints: (build) => ({
        updateDevice: build.mutation<{}, { deviceID: string; data: EditDeviceFormData }>({
            query: ({ deviceID, data }) => ({
                url: `device/${deviceID}`,
                method: 'PATCH',
                body: { formData: { EDIT_DEVICE: data } },
            }),
            invalidatesTags: ['Devices'],
        }),
        deleteDevice: build.mutation<undefined, { deviceID: string }>({
            query: ({ deviceID }) => ({
                url: `device/${deviceID}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Devices'],
        }),
        devices: build.query<{ docs: IDevice[] }, void>({
            query: () => `device`,

            providesTags: ['Devices'],
        }),
        devicesAll: build.query<{ docs: IDevice[] }, void>({
            query: () => `device?filter=all`,
            providesTags: ['DevicesAll'],
        }),
        sendDeviceCommand: build.mutation<undefined, { deviceID: string, command: DeviceCommand }>({
            query: ({ deviceID, command }) => ({
                url: `device/${deviceID}`,
                method: 'POST',
                body: { formData: { DEVICE_SEND: { command: command } } },
            }),
        }),
    }),
});

export const { useDevicesQuery, useLazyDevicesQuery, useUpdateDeviceMutation, useDeleteDeviceMutation, useSendDeviceCommandMutation, useDevicesAllQuery } = devicesApi;
