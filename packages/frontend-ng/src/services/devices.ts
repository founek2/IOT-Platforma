import { IDevice } from 'common/src/models/interface/device';
import { api } from './api';

export const devicesApi = api.injectEndpoints({
    endpoints: (build) => ({
        devices: build.query<{ docs: IDevice[] }, undefined>({
            query: () => `device`,
            providesTags: ['Devices'],
        }),
    }),
});

export const { useDevicesQuery } = devicesApi;
