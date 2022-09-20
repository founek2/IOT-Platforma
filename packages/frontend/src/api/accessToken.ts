import { IUser } from 'common/src/models/interface/userInterface';
import { postJson, paramSender, deleteJson, patchJson, SenderParam } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderJsonNoUrl, SenderParamNoUrl } from './setup';

type updateAccessTokenParams = SenderJsonNoUrl & { userId: string; tokenId: string };
export const updateAccessToken = ({ userId, tokenId, ...object }: updateAccessTokenParams, dispatch: Dispatch) =>
    patchJson(
        {
            url: API_URL + '/user/' + userId + '/accessToken/' + tokenId,
            successMessage: 'successfullyUpdated',
            ...object,
        },
        dispatch
    );

export const deleteAccessToken = ({ userId, tokenId, ...object }: updateAccessTokenParams, dispatch: Dispatch) =>
    deleteJson(
        {
            url: API_URL + '/user/' + userId + '/accessToken/' + tokenId,
            successMessage: 'successfullyDeleted',
            ...object,
        },
        dispatch
    );

type createAccessTokenParams = SenderJsonNoUrl & { userId: string };
export const createAccessToken = ({ userId, ...object }: createAccessTokenParams, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + '/user/' + userId + '/accessToken',
            successMessage: 'tokenCreated',
            ...object,
        },
        dispatch
    );

type fetchAccessTokenParams = SenderParamNoUrl & { userId: string };
export const fetchAccessToken = ({ userId, ...object }: fetchAccessTokenParams, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/user/' + userId + '/accessToken',
            ...object,
        },
        dispatch
    );
