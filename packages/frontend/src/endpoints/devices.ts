import { IDevice } from 'common/src/models/interface/device';
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
        devices: build.query<{ docs: IDevice[] }, undefined>({
            query: () => `device`,

            providesTags: ['Devices'],
        }),
    }),
});

export const { useDevicesQuery, useLazyDevicesQuery, useUpdateDeviceMutation, useDeleteDeviceMutation } = devicesApi;
