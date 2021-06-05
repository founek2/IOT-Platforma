import { postJson, paramSender, deleteJson, patchJson } from 'framework-ui/lib/api';

const API_URL = '/api';

export const updateAccessToken = ({ userId, tokenId, ...object }: any, dispatch: any) =>
    patchJson({
        url: API_URL + '/user/' + userId + '/accessToken/' + tokenId,
        ...object,
        dispatch,
    });

export const createAccessToken = ({ userId, ...object }: any, dispatch: any) =>
    postJson({
        url: API_URL + '/user/' + userId + '/accessToken',
        ...object,
        dispatch,
    });
