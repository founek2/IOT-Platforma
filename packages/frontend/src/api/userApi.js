import { putJson, postJson } from 'framework-ui/lib/api';

export const API_URL = '/api';

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
