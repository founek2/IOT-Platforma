import { deleteJson, paramSender, postJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderParamNoUrl } from './setup';

export const fetchDiscovery = (object: SenderParamNoUrl, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/discovery',
            ...object,
        },
        dispatch
    );

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
