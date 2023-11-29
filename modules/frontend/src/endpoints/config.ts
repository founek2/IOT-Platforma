import { IDevice } from 'common/src/models/interface/device';
import { Measurement } from 'common/src/types';
import { Device } from '../store/slices/application/devicesSlice';
import { api } from './api';

export const devicesApi = api.injectEndpoints({
    endpoints: (build) => ({
        vapidKey: build.query<string, undefined>({
            query: () => `config/notification`,
            providesTags: ['NotificationConfig'],
            transformResponse: (body: { vapidPublicKey: string }) => body.vapidPublicKey
        }),
    }),
});

export const { useVapidKeyQuery } = devicesApi;
