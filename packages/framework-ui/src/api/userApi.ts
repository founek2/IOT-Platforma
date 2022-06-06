import { postJson, paramSender, deleteJson, putJson, patchJson, SenderParam, SenderJson } from '.';
import { Dispatch } from '@reduxjs/toolkit';

const API_URL = '/api';

type SenderJsonOmitted = Omit<SenderJson, 'url' | 'dispatch'>;
type SenderParamOmitted = Omit<SenderParam, 'url' | 'dispatch' | 'method'>;

export const login = (object: SenderJsonOmitted, dispatch: Dispatch) =>
    postJson({
        url: API_URL + '/auth/user',
        ...object,
        successMessage: 'successfullyLoggedIn',
        dispatch,
    });

export const create = (object: SenderJsonOmitted, dispatch: Dispatch) =>
    postJson({
        url: API_URL + '/user',
        ...object,
        successMessage: 'userCreated',
        dispatch,
    });

export const getUsers = (object: SenderParamOmitted, dispatch: Dispatch) =>
    paramSender({
        url: API_URL + '/user',
        method: 'GET',
        ...object,
        dispatch,
    });

export type SenderParamWithUsername = SenderParamOmitted & { userName: string };
export const getUserAuthType = ({ userName, ...rest }: SenderParamWithUsername, dispatch: Dispatch) =>
    paramSender({
        url: API_URL + `/user/${userName}`,
        method: 'GET',
        ...rest,
        dispatch,
    });

export const getUsersActiveBefore = (object, dispatch) =>
    paramSender({
        url: API_URL + '/users/activeBefore',
        ...object,
        dispatch,
    });

export type SenderJsonWithId = SenderJsonOmitted & { id: any };
export const deleteUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    deleteJson({
        url: API_URL + `/user/${id}`,
        ...object,
        successMessage: 'userSuccessfullyDeleted',
        dispatch,
    });

export const updateUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    putJson({
        url: API_URL + `/user/${id}`,
        ...object,
        successMessage: 'userUpdated',
        dispatch,
    });

export const patchUser = ({ id, ...object }: SenderJsonWithId, dispatch: Dispatch) =>
    patchJson({
        url: API_URL + `/user/${id}`,
        ...object,
        successMessage: 'userUpdated',
        dispatch,
    });
