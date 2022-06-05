import { deleteJson, paramSender, postJson } from 'framework-ui/src/api';

export const API_URL = '/api';

export const fetchDiscovery = (object, dispatch) =>
    paramSender({
        url: API_URL + '/discovery',
        ...object,
        dispatch,
    });

export const deleteDiscovery = ({ id, ...object }, dispatch) =>
    deleteJson({
        url: `${API_URL}/discovery/${id}`,
        ...object,
        dispatch,
        successMessage: 'deviceDeleted',
    });

export const addDiscoveredDevice = ({ id, ...object }, dispatch) =>
    postJson({
        url: API_URL + `/discovery/${id}`,
        ...object,
        dispatch,
    });
