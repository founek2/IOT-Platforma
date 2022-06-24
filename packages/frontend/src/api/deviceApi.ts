import { postJson, paramSender, deleteJson, patchJson, putJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderParamNoUrl } from './setup';

export const postDevice = ({ id, ...object }, dispatch) =>
    postJson({
        url: API_URL + `/device/${id}`,
        ...object,
        successMessage: 'commandSended',
        dispatch,
    });

export const updateState = ({ id, ...object }, dispatch) =>
    patchJson({
        url: API_URL + `/device/${id}`,
        ...object,
        // successMessage: 'deviceCreated',
        dispatch,
    });

export const fetchDevices = (object, dispatch) =>
    paramSender(
        {
            url: API_URL + '/device',
            ...object,
        },
        dispatch
    );

export const updateDevice = ({ id, ...object }, dispatch) =>
    patchJson({
        url: API_URL + `/device/${id}`,
        ...object,
        successMessage: 'deviceUpdated',
        dispatch,
    });

export const deleteDevice = ({ id, ...object }, dispatch) =>
    deleteJson({
        url: API_URL + `/device/${id}`,
        ...object,
        successMessage: 'deviceDeleted',
        dispatch,
    });

type fetchDeviceDataParams = SenderParamNoUrl & { id: string };
export const fetchDeviceData = ({ id, ...object }: fetchDeviceDataParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/device/${id}`,
            ...object,
        },
        dispatch
    );

export const updateNotify = ({ id, nodeId, ...object }, dispatch) =>
    putJson({
        url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
        ...object,
        successMessage: 'notificationsUpdated',
        dispatch,
    });

type getNotifyParams = SenderParamNoUrl & { id: string; nodeId: string };
export const getNotify = ({ id, nodeId, ...object }: getNotifyParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
            ...object,
        },
        dispatch
    );
