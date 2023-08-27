import { IThingProperty } from 'common/src/models/interface/thing.js';
import { Measurement } from 'common/src/types.js';
import { subDays } from 'date-fns';
import { Device } from '../store/slices/application/devicesSlice.js';
import { Thing } from '../store/slices/application/thingsSlice.js';
import { api } from './api.js';

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
