import { postJson, paramSender, deleteJson, patchJson, putJson } from 'framework-ui/src/api';

export const API_URL = '/api';

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
    paramSender({
        url: API_URL + '/device',
        ...object,
        dispatch,
    });

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

export const fetchDeviceData = ({ id, ...object }, dispatch) =>
    paramSender({
        url: API_URL + `/device/${id}`,
        ...object,
        dispatch,
    });

export const updateNotify = ({ id, nodeId, ...object }, dispatch) =>
    putJson({
        url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
        ...object,
        successMessage: 'notificationsUpdated',
        dispatch,
    });

export const getNotify = ({ id, nodeId, ...object }, dispatch) =>
    paramSender({
        url: API_URL + `/device/${id}/thing/${nodeId}/notify`,
        ...object,
        dispatch,
    });
