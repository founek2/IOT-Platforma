import { IThingProperty } from 'common/src/models/interface/thing';
import { Measurement } from 'common/src/types';
import { subDays } from 'date-fns';
import { Device } from '../store/slices/application/devicesSlice';
import { Thing } from '../store/slices/application/thingsSlice';
import { api } from './api';

interface HistoryResponse {
    docs: Measurement[];
}
export interface UpdateThingStateArgs {
    deviceId: Device['_id'];
    nodeId: Thing['config']['nodeId'];
    thingId: Thing['_id'];
    propertyId: IThingProperty['propertyId'];
    value: string | number | boolean;
}
export const thingsApi = api.injectEndpoints({
    endpoints: (build) => ({
        thingHistory: build.query<
            HistoryResponse['docs'],
            { deviceID: Device['_id']; thingID: Thing['config']['nodeId'] }
        >({
            query: ({ deviceID, thingID }) =>
                `device/${deviceID}/thing/${thingID}/history?from=${subDays(new Date(), 1).getTime()}`,
            transformResponse: (res: HistoryResponse) => res.docs,
            providesTags: ['History'],
        }),
        updateThingState: build.mutation<undefined, UpdateThingStateArgs>({
            query: ({ deviceId, nodeId, propertyId, value }) => ({
                url: `device/${deviceId}/thing/${nodeId}?property=${propertyId}&value=${value}`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useLazyThingHistoryQuery, useUpdateThingStateMutation } = thingsApi;
