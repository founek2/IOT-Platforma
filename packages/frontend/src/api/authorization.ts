import { postJson, getJson } from 'framework-ui/src/api';

const API_URL = '/api';

export const fetchAuthorization = (object: any, dispatch: any) =>
    getJson({
        url: API_URL + `/auth/user`,
        ...object,
        dispatch,
    });

export const postAuthorization = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/auth/user`,
        ...object,
        successMessage: 'successfullyLoggedIn',
        dispatch,
    });

export const postSignOut = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/authorization/signOut`,
        ...object,
        successMessage: 'successfullySignedOut',
        dispatch,
    });
