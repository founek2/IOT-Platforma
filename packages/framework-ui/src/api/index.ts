import { Dispatch } from '@reduxjs/toolkit';
import { forEach, toPairs } from 'ramda';
import ErrorMessages from '../localization/errorMessages';
import SuccessMessages from '../localization/successMessages';
import { dehydrateState } from '../redux/actions/';
import { notificationsActions } from '../redux/actions/application/notifications';

const addNotification = notificationsActions.add;
const processResponse = (dispatch: Dispatch, successMessage?: string) => async (response: Response) => {
    const { status } = response;
    // set new jwt token, when provided from backend

    // const bodyLen = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    const isJson = contentType ? ~contentType.indexOf('application/json') : false;

    const jsonBody = isJson ? await response.json() : undefined;
    const errorMessage = jsonBody ? jsonBody.error : undefined;

    const newToken = response.headers.get('authorization-jwt-new');
    if (newToken) {
        console.error('Unable to set resigned token, actions moved to FE');
        // dispatch(userActions.update({ token: newToken }));
        // @ts-ignore
        dispatch(dehydrateState());
    }

    if (status === 502 || status === 504) {
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage(errorMessage || 'unavailableBackend'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else if (status === 500) {
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage(errorMessage || 'unexpectedError'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else if (status === 501) {
        dispatch(
            addNotification({ message: ErrorMessages.getMessage('notImplemented'), variant: 'error', duration: 3000 })
        );
        throw new Error('breakChain');
    } else if (status === 404) {
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage(errorMessage || 'entityNotFound'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else if (status === 413) {
        dispatch(
            addNotification({ message: ErrorMessages.getMessage('payloadTooLarge'), variant: 'error', duration: 3000 })
        );
        throw new Error('breakChain');
    } else if (status === 403) {
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage('invalidPermissions'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else if (status === 400) {
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage(errorMessage || 'InvalidParam'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else if (status === 204) {
        if (successMessage)
            return dispatch(
                addNotification({
                    message: SuccessMessages.getMessage(successMessage),
                    variant: 'success',
                    duration: 3000,
                })
            );
    } else if (status !== 200) {
        // 208 - my error code
        dispatch(
            addNotification({
                message: ErrorMessages.getMessage(errorMessage || 'unexpectedError'),
                variant: 'error',
                duration: 3000,
            })
        );
        throw new Error('breakChain');
    } else {
        if (successMessage)
            dispatch(
                addNotification({
                    message: SuccessMessages.getMessage(successMessage),
                    variant: 'success',
                    duration: 3000,
                })
            );

        return jsonBody;
    }
};

const checkError = (Fn: undefined | ((err: Error) => any), error: any) => {
    console.warn('API catch> ' + error, error.stack);
    // if (error.message !== 'breakChain' && Fn)
    if (Fn) Fn(error);
};

function buildParams<S>(params: { [k: string]: S }) {
    let result = '?';
    if (params) {
        const toString = ([key, value]: [string, any]) => {
            result += key + '=' + value + '&';
        };
        forEach(toString, toPairs(params));
    }
    return result.slice(0, -1);
}

interface GeneralSenderParams {
    url: string;
    token?: string;
    onSuccess?: (data: any) => boolean | any;
    onError?: (err: any) => any;
    onFinish?: () => void;
    method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'GET';
    successMessage?: string;
}
type JsonSenderParams = GeneralSenderParams & { body?: any };
export async function jsonSender(
    { url, token = '', onSuccess, onError, onFinish, method, body, successMessage }: JsonSenderParams,
    dispatch: Dispatch
): Promise<boolean | any> {
    let catched = false;
    let successValue = undefined;
    try {
        const response = await fetch(url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const json = await processResponse(dispatch, successMessage)(response);
        if (onSuccess) successValue = onSuccess(json);
    } catch (e) {
        checkError(onError, e);
        catched = true;
    }
    onFinish && onFinish();
    return successValue ?? !catched;
}

export type SenderParam<T = any> = GeneralSenderParams & { params: T };
export const paramSender = async (
    { url, token = '', onSuccess, onError, onFinish, method = 'GET', params, successMessage }: SenderParam,
    dispatch: Dispatch
) => {
    let catched = false;
    try {
        const response = await fetch(url + (params ? buildParams(params) : ''), {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await processResponse(dispatch, successMessage)(response);
        if (onSuccess) onSuccess(json);
    } catch (e) {
        catched = true;
        checkError(onError, e);
    }
    onFinish && onFinish();
    return !catched;
};

export type SenderJson = Omit<JsonSenderParams, 'method'>;
export const postJson = function (props: SenderJson, dispatch: Dispatch) {
    return jsonSender({ ...props, method: 'POST' }, dispatch);
};

export const putJson = function (props: SenderJson, dispatch: Dispatch) {
    return jsonSender({ ...props, method: 'PUT' }, dispatch);
};

export const deleteJson = function (props: SenderJson, dispatch: Dispatch) {
    return jsonSender({ ...props, method: 'DELETE' }, dispatch);
};

export const patchJson = function (props: SenderJson, dispatch: Dispatch) {
    return jsonSender({ ...props, method: 'PATCH' }, dispatch);
};

export const getJson = function (props: SenderJson, dispatch: Dispatch) {
    return jsonSender({ ...props, method: 'GET' }, dispatch);
};
// export const postJson = o(jsonSender, flip(merge)({ method: 'POST' }));

// export const putJson = o(jsonSender, flip(merge)({ method: 'PUT' }));

// export const deleteJson = o(jsonSender, flip(merge)({ method: 'DELETE' }));

// export const patchJson = o(jsonSender, flip(merge)({ method: 'PATCH' }));

// export const getJson = o(jsonSender, flip(merge)({ method: 'GET' }));
