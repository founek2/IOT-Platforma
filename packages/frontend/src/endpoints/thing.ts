import { INotifyThing, NotifyType } from 'common/src/models/interface/notifyInterface';
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
export interface EditThingFormData {
    config: Thing["config"];
}
export interface EditNotificationsFormData {
    propertyId: string[]
    type: NotifyType[]
    value: string[]
    advanced: {
        daysOfWeek: number[][]
        interval: number[]
        from: string[]
        to: string[]
    }
    count: number
}
export const thingsApi = api.injectEndpoints({
    endpoints: (build) => ({
        thingHistory: build.query<HistoryResponse['docs'], { deviceID: Device['_id']; thingID: Thing['config']['nodeId'] }>({
            query: ({ deviceID, thingID }) =>
                `device/${deviceID}/thing/${thingID}/history?from=${subDays(new Date(), 1).getTime()}`,
            transformResponse: (res: HistoryResponse) => res.docs,
            providesTags: ['History'],
        }),
        thingNotifications: build.query<INotifyThing, { deviceID: Device['_id']; thingID: Thing['config']['nodeId'] }>({
            query: ({ deviceID, thingID }) =>
                `device/${deviceID}/thing/${thingID}/notify`,
            transformResponse: (res: any) => res.doc.thing,
            providesTags: ['ThingNotifications'],
        }),
        updateThingState: build.mutation<undefined, UpdateThingStateArgs>({
            query: ({ deviceId, nodeId, propertyId, value }) => ({
                url: `device/${deviceId}/thing/${nodeId}?property=${propertyId}&value=${value}`,
                method: 'POST',
            }),
        }),
        updateThing: build.mutation<undefined, { deviceId: string, nodeId: string, data: EditThingFormData }>({
            query: ({ deviceId, nodeId, data }) => ({
                url: `device/${deviceId}/thing/${nodeId}`,
                method: 'PUT',
                body: { formData: { EDIT_THING: data } },
                invalidatesTags: ["Devices"]
            }),
        }),
        updateThingNotifications: build.mutation<undefined, { deviceId: string, nodeId: string, data: EditNotificationsFormData }>({
            query: ({ deviceId, nodeId, data }) => ({
                url: `device/${deviceId}/thing/${nodeId}/notify`,
                method: 'PUT',
                body: { formData: { EDIT_NOTIFY: data } },
                invalidatesTags: ["ThingNotifications"]
            }),
        }),
    }),
});

export const { useLazyThingHistoryQuery, useUpdateThingStateMutation, useUpdateThingMutation, useThingNotificationsQuery, useUpdateThingNotificationsMutation } = thingsApi;
