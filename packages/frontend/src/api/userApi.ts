import { postJson, paramSender, deleteJson, putJson, patchJson, SenderParam, SenderJson } from 'framework-ui/src/api';
import { Dispatch } from '@reduxjs/toolkit';
import { SenderJsonNoUrl, SenderParamNoUrl } from './setup';

const API_URL = '/api';

export const login = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + '/auth/user/signIn',
            ...object,
            successMessage: 'successfullyLoggedIn',
        },
        dispatch
    );

export const create = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + '/user',
            ...object,
            successMessage: 'userCreated',
        },
        dispatch
    );

export const getUsers = (object: SenderParamNoUrl, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/user',
            method: 'GET',
            ...object,
        },
        dispatch
    );

export type SenderParamWithUsername = SenderParamNoUrl & { userName: string };
export const getUserAuthType = ({ userName, ...rest }: SenderParamWithUsername, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/user/${userName}`,
            method: 'GET',
            ...rest,
        },
        dispatch
    );

export const getUsersActiveBefore = (object: SenderParamNoUrl, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + '/users/activeBefore',
            ...object,
        },
        dispatch
    );

export type SenderJsonWithId = SenderJsonNoUrl & { id: any };
export const deleteUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    deleteJson(
        {
            url: API_URL + `/user/${id}`,
            ...object,
            successMessage: 'userSuccessfullyDeleted',
        },
        dispatch
    );

export const updateUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    putJson(
        {
            url: API_URL + `/user/${id}`,
            ...object,
            successMessage: 'userUpdated',
        },
        dispatch
    );

export const patchUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    patchJson(
        {
            url: API_URL + `/user/${id}`,
            ...object,
            successMessage: 'userUpdated',
        },
        dispatch
    );

export const updateUserNoMessage = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) => {
    putJson(
        {
            url: API_URL + `/user/${id}`,
            ...object,
            // successMessage: 'userUpdated',
        },
        dispatch
    );
};

export const forgotPassword = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + '/user',
            ...object,
            successMessage: 'commandSended',
        },
        dispatch
    );
