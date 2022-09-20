import { postJson, paramSender, deleteJson, patchJson, putJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderJsonNoUrl, SenderParamNoUrl } from './setup';
import { SenderJsonWithId } from './userApi';

export const postDevice = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + `/device/${id}`,
            ...object,
            successMessage: 'commandSended',
        },
        dispatch
    );

export const updateState = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    patchJson(
        {
            url: API_URL + `/device/${id}`,
            ...object,
            // successMessage: 'deviceCreated',
        },
        dispatch
    );

export const fetchDevices = (object: SenderParamNoUrl, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/device',
            ...object,
        },
        dispatch
    );

export const updateDevice = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    patchJson(
        {
            url: API_URL + `/device/${id}`,
            ...object,
            successMessage: 'deviceUpdated',
        },
        dispatch
    );

export const deleteDevice = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    deleteJson(
        {
            url: API_URL + `/device/${id}`,
            ...object,
            successMessage: 'deviceDeleted',
        },
        dispatch
    );

type fetchDeviceDataParams = SenderParamNoUrl & { id: string };
export const fetchDeviceData = ({ id, ...object }: fetchDeviceDataParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/device/${id}`,
            ...object,
        },
        dispatch
    );

type updateNotifyParams = SenderJsonNoUrl & { id: string; nodeId: string };
export const updateNotify = ({ id, nodeId, ...object }: updateNotifyParams, dispatch: Dispatch) =>
    putJson(
        {
            url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
            ...object,
            successMessage: 'notificationsUpdated',
        },
        dispatch
    );

type getNotifyParams = SenderParamNoUrl & { id: string; nodeId: string };
export const getNotify = ({ id, nodeId, ...object }: getNotifyParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
            ...object,
        },
        dispatch
    );
