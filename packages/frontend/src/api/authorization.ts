import { postJson, getJson } from 'framework-ui/src/api';
import { Dispatch } from 'redux';
import { API_URL, SenderJsonNoUrl } from './setup';

export const fetchAuthorization = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    getJson(
        {
            url: API_URL + `/auth/user/signIn`,
            ...object,
        },
        dispatch
    );

export const postAuthorization = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + `/auth/user/signIn`,
            ...object,
            successMessage: 'successfullyLoggedIn',
        },
        dispatch
    );

export const postSignOut = (object: SenderJsonNoUrl, dispatch: Dispatch) =>
    postJson(
        {
            url: API_URL + `/auth/user/signOut`,
            ...object,
            successMessage: 'successfullySignedOut',
        },
        dispatch
    );
