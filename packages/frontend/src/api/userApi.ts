import { postJson, paramSender, deleteJson, putJson, patchJson, SenderParam, SenderJson } from 'framework-ui/src/api';
import { Dispatch } from '@reduxjs/toolkit';

const API_URL = '/api';

type SenderJsonOmitted = Omit<SenderJson, 'url'>;
type SenderParamOmitted = Omit<SenderParam, 'url'>;

export const login = (object: SenderJsonOmitted, dispatch: Dispatch) =>
    postJson({
        url: API_URL + '/auth/user/signIn',
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
    paramSender(
        {
            url: API_URL + '/user',
            method: 'GET',
            ...object,
        },
        dispatch
    );

export type SenderParamWithUsername = SenderParamOmitted & { userName: string };
export const getUserAuthType = ({ userName, ...rest }: SenderParamWithUsername, dispatch: Dispatch) =>
    paramSender(
        {
            url: API_URL + `/user/${userName}`,
            method: 'GET',
            ...rest,
            dispatch,
        },
        dispatch
    );

export const getUsersActiveBefore = (object, dispatch) =>
    paramSender(
        {
            url: API_URL + '/users/activeBefore',
            ...object,
            dispatch,
        },
        dispatch
    );

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

export const updateUserNoMessage = ({ id, ...object }, dispatch) => {
    putJson({
        url: API_URL + `/user/${id}`,
        ...object,
        // successMessage: 'userUpdated',
        dispatch,
    });
};

export const forgotPassword = (object, dispatch) =>
    postJson({
        url: API_URL + '/user',
        ...object,
        successMessage: 'commandSended',
        dispatch,
    });
