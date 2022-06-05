import { postJson, paramSender, deleteJson, patchJson } from 'framework-ui/src/api';

const API_URL = '/api';

export const updateAccessToken = ({ userId, tokenId, ...object }: any, dispatch: any) =>
    patchJson({
        url: API_URL + '/user/' + userId + '/accessToken/' + tokenId,
        successMessage: 'successfullyUpdated',
        ...object,
        dispatch,
    });

export const deleteAccessToken = ({ userId, tokenId, ...object }: any, dispatch: any) =>
    deleteJson({
        url: API_URL + '/user/' + userId + '/accessToken/' + tokenId,
        successMessage: 'successfullyDeleted',
        ...object,
        dispatch,
    });

export const createAccessToken = ({ userId, ...object }: any, dispatch: any) =>
    postJson({
        url: API_URL + '/user/' + userId + '/accessToken',
        successMessage: 'tokenCreated',
        ...object,
        dispatch,
    });

export const fetchAccessToken = ({ userId, ...object }: any, dispatch: any) =>
    paramSender({
        url: API_URL + '/user/' + userId + '/accessToken',
        ...object,
        dispatch,
    });
