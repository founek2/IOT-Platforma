import { IDevice } from 'common/src/models/interface/device.js';
import { Measurement } from 'common/src/types.js';
import { Device } from '../store/slices/application/devicesSlice.js';
import { api } from './api.js';

export interface EditDeviceFormData {
    info: Device['info'];
    permissions: Device['permissions'];
}
interface HistoryResponse {
    docs: Measurement[];
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
