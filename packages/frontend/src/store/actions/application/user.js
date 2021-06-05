import ErrorMessages from 'framework-ui/lib/localization/errorMessages';
import { baseLogger } from 'framework-ui/lib/logger';
import { addNotification } from 'framework-ui/lib/redux/actions/application/notifications';
import { getToken, getUserId, getFormData } from 'framework-ui/lib/utils/getters';
import { getAuthChallenge as getAuthChallengeApi } from '../../../api/authApi';
import {
    updateUserNoMessage as updateUserNoMessageApi,
    forgotPassword as forgotPasswordApi,
} from '../../../api/userApi';
import {
    updateAccessToken as updateAccessTokenApi,
    createAccessToken as createAccessTokenApi,
} from '../../../api/accessToken';
import { validateForm, resetForm, removeForm } from 'framework-ui/lib/redux/actions/formsData';

export function getAuthChallenge() {
    return function (dispatch) {
        return getAuthChallengeApi(
            {
                onSuccess: (json) => {
                    return json;
                },
            },
            dispatch
        );
    };
}

export function registerToken(token) {
    return function (dispatch, getState) {
        const FIREBASE_ADD = 'FIREBASE_ADD';
        baseLogger(FIREBASE_ADD);

        if (!token)
            return dispatch(
                addNotification({
                    message: ErrorMessages.getMessage('notificationsDisabled'),
                    variant: 'error',
                    duration: 3000,
                })
            );

        const state = getState();
        return updateUserNoMessageApi(
            {
                id: getUserId(state),
                token: getToken(state),
                body: { formData: { [FIREBASE_ADD]: { token } } },
            },
            dispatch
        );
    };
}

export function forgot(FORM_NAME) {
    return function (dispatch, getState) {
        baseLogger(FORM_NAME);

        const result = dispatch(validateForm(FORM_NAME)());
        const formData = getFormData(FORM_NAME)(getState());
        if (result.valid) {
            return forgotPasswordApi(
                {
                    body: { formData: { [FORM_NAME]: formData } },
                    onSuccess: () => {
                        dispatch(removeForm(FORM_NAME)());
                    },
                },
                dispatch
            );
        }
    };
}

export default {
    getAuthChallenge,
};
