import { IUser } from 'common/src/models/interface/userInterface';
import { postJson, paramSender, deleteJson, patchJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderParamNoUrl } from './setup';

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

type fetchAccessTokenParams = SenderParamNoUrl & { userId: string };
export const fetchAccessToken = ({ userId, ...object }: fetchAccessTokenParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/user/' + userId + '/accessToken',
            ...object,
        },
        dispatch
    );
