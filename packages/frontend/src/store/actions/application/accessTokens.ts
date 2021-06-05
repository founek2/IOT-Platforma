import { IAccessToken, IUser } from 'common/lib/models/interface/userInterface';
import { ActionTypes } from '../../../constants/redux';
import { baseLogger } from 'framework-ui/lib/logger';
import { validateForm } from 'framework-ui/lib/redux/actions/formsData';
import { getFormData, getToken } from 'framework-ui/lib/utils/getters';
import { IState } from 'frontend/src/types';
import {
    createAccessToken as createAccessTokenApi,
    updateAccessToken as updateAccessTokenApi,
    fetchAccessToken as fetchAccessTokenApi,
    deleteAccessToken as deleteAccessTokenApi,
} from '../../../api/accessToken';

export function set(data: IAccessToken[]) {
    return {
        type: ActionTypes.SET_ACCESS_TOKENS,
        payload: data,
    };
}

export function update(data: IAccessToken) {
    return {
        type: ActionTypes.UPDATE_ACCESS_TOKENS,
        payload: data,
    };
}

export function remove(tokenId: IAccessToken['_id']) {
    return {
        type: ActionTypes.REMOVE_ACCESS_TOKEN,
        payload: tokenId,
    };
}

export function add(data: IAccessToken) {
    return {
        type: ActionTypes.ADD_ACCESS_TOKEN,
        payload: data,
    };
}

export function createAccessToken(userId: IUser['_id']) {
    return function (dispatch: any, getState: () => IState) {
        const ADD_ACCESS_TOKEN = 'ADD_ACCESS_TOKEN';
        baseLogger(ADD_ACCESS_TOKEN);

        const result = dispatch(validateForm(ADD_ACCESS_TOKEN)());
        const formData = getFormData(ADD_ACCESS_TOKEN)(getState());
        if (result.valid) {
            return createAccessTokenApi(
                {
                    userId,
                    token: getToken(getState()),
                    body: { formData: { [ADD_ACCESS_TOKEN]: formData } },
                    onSuccess: (json: { doc: IAccessToken }) => {
                        dispatch(add(json.doc));
                    },
                },
                dispatch
            );
        }
    };
}

export function updateAccessToken(tokenId: IAccessToken['_id'], userId: IUser['_id']) {
    return function (dispatch: any, getState: () => IState) {
        const EDIT_ACCESS_TOKEN = 'EDIT_ACCESS_TOKEN';
        baseLogger(EDIT_ACCESS_TOKEN);

        const result = dispatch(validateForm(EDIT_ACCESS_TOKEN)());
        const formData: any = getFormData(EDIT_ACCESS_TOKEN)(getState());
        if (result.valid) {
            return updateAccessTokenApi(
                {
                    tokenId,
                    userId,
                    token: getToken(getState()),
                    body: { formData: { [EDIT_ACCESS_TOKEN]: formData } },
                    onSuccess: () => {
                        dispatch(update({ _id: tokenId, ...formData }));
                    },
                },
                dispatch
            );
        }
    };
}

export function fetchAccessTokens(userId: IUser['_id']) {
    return function (dispatch: any, getState: () => IState) {
        baseLogger('FETCH_ACCIESS_TOKENS');

        return fetchAccessTokenApi(
            {
                userId,
                token: getToken(getState()),
                onSuccess: (json: { docs: IAccessToken[] }) => {
                    dispatch(set(json.docs));
                },
            },
            dispatch
        );
    };
}

export function deleteAccessToken(tokenId: IAccessToken['_id'], userId: IUser['_id']) {
    return function (dispatch: any, getState: () => IState) {
        baseLogger('DELETE_ACCESS_TOKEN');

        return deleteAccessTokenApi(
            {
                tokenId,
                userId,
                token: getToken(getState()),
                onSuccess: () => {
                    dispatch(remove(tokenId));
                },
            },
            dispatch
        );
    };
}
