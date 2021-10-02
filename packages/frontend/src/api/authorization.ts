import { postJson, getJson } from 'framework-ui/lib/api';

const API_URL = '/api';

export const fetchAuthorization = (object: any, dispatch: any) =>
    getJson({
        url: API_URL + `/authorization`,
        ...object,
        dispatch,
    });

export const postAuthorization = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/authorization`,
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
