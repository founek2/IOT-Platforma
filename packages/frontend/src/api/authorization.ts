import { postJson, getJson } from 'framework-ui/src/api';
import { API_URL } from './setup';

export const fetchAuthorization = (object: any, dispatch: any) =>
    getJson({
        url: API_URL + `/auth/user/signIn`,
        ...object,
        dispatch,
    });

export const postAuthorization = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/auth/user/signIn`,
        ...object,
        successMessage: 'successfullyLoggedIn',
        dispatch,
    });

export const postSignOut = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/auth/user/signOut`,
        ...object,
        successMessage: 'successfullySignedOut',
        dispatch,
    });
