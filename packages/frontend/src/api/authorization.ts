import { postJson } from 'framework-ui/lib/api';

const API_URL = '/api';

export const postAuthorization = (object: any, dispatch: any) =>
    postJson({
        url: API_URL + `/authorization`,
        ...object,
        successMessage: 'successfullyLoggedIn',
        dispatch,
    });
