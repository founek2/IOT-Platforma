import { deleteJson, paramSender, postJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderParamNoUrl } from './setup';
import { SenderJsonWithId } from './userApi';

export const fetchDiscovery = (object: SenderParamNoUrl, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/discovery',
            ...object,
        },
        dispatch
    );

export const deleteDiscovery = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    deleteJson(
        {
            url: `${API_URL}/discovery/${id}`,
            ...object,
            successMessage: 'deviceDeleted',
        },
        dispatch
    );

export const addDiscoveredDevice = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + `/discovery/${id}`,
            ...object,
        },
        dispatch
    );
