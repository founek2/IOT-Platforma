import { IDevice } from 'common/src/models/interface/device';
import { Measurement } from 'common/src/types';
import { Device } from '../store/slices/application/devicesSlice';
import { api } from './api';

export interface EditDeviceForm {
    info: Device['info'];
    permissions: Device['permissions'];
}
interface HistoryResponse {
    docs: Measurement[];
}
export const devicesApi = api.injectEndpoints({
    endpoints: (build) => ({
        updateDevice: build.mutation<{}, { deviceID: string; data: EditDeviceForm }>({
            query: ({ deviceID, data }) => ({
                url: `device/${deviceID}`,
                method: 'PATCH',
                body: { formData: { EDIT_DEVICE: data } },
            }),
            invalidatesTags: ['Devices'],
        }),
        devices: build.query<{ docs: IDevice[] }, undefined>({
            query: () => `device`,

            providesTags: ['Devices'],
        }),
        thingHistory: build.query<HistoryResponse['docs'], { deviceID: string; thingID: string }>({
            query: ({ deviceID, thingID }) => `device/${deviceID}/thing/${thingID}/history`,
            transformResponse: (res: HistoryResponse) => res.docs,
            providesTags: ['History'],
        }),
    }),
});

export const { useDevicesQuery, useUpdateDeviceMutation, useLazyThingHistoryQuery } = devicesApi;
