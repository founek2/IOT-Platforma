import { api } from './api';
import { IDiscovery } from 'common/src/models/interface/discovery';

export type Discovery = IDiscovery & { _id: string };

export interface CreateDeviceForm {
    info: {
        name: string;
        location: {
            building: string;
            room: string;
        };
    };
}

export const discoveryApi = api.injectEndpoints({
    endpoints: (build) => ({
        discoveredDevices: build.query<Discovery[], undefined>({
            query: () => '/discovery',
            providesTags: ['DiscoveredDevices'],
            transformResponse: (response: { docs: Discovery[] }) => response.docs,
        }),
        createDevice: build.mutation<undefined, { deviceID: string; data: CreateDeviceForm }>({
            query: ({ deviceID, data }) => ({
                url: `/discovery/${deviceID}`,
                method: 'POST',
                body: { formData: { CREATE_DEVICE: data } },
            }),
            invalidatesTags: ['Devices'],
        }),
        deleteDiscoveryDevice: build.mutation<undefined, { deviceID: string }>({
            query: ({ deviceID }) => ({
                url: `/discovery/${deviceID}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DiscoveredDevices'],
        }),
    }),
});

export const { useDiscoveredDevicesQuery, useCreateDeviceMutation, useDeleteDiscoveryDeviceMutation } = discoveryApi;
