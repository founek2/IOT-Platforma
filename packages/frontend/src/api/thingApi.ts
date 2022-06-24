import { paramSender } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderParamNoUrl } from './setup';

export type fetchHistoryParams = SenderParamNoUrl<{ from: any; to?: any }> & { deviceId: string; thingId: string };
export const fetchHistory = ({ deviceId, thingId, ...object }: fetchHistoryParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/device/' + deviceId + '/thing/' + thingId + '/history',
            ...object,
        },
        dispatch
    );

export type updateStateParams = SenderParamNoUrl<{ property: string; value: any }> & {
    deviceId: string;
    nodeId: string;
};
export const updateState = ({ deviceId, nodeId, params, ...object }: updateStateParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/device/' + deviceId + '/thing/' + nodeId,
            method: 'POST',
            params,
            ...object,
        },
        dispatch
    );
