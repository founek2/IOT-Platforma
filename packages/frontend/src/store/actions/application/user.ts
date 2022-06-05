import { STATE_DEHYDRATED } from 'framework-ui/src/constants/redux';
import ErrorMessages from 'framework-ui/src/localization/errorMessages';
import { logger } from 'framework-ui/src/logger';
import { notificationsActions } from 'framework-ui/src/redux/actions/application/notifications';
import { userActions as userAct } from 'framework-ui/src/redux/actions/application/user';
import { usersActions } from 'framework-ui/src/redux/actions/application/users';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { removeItem } from 'framework-ui/src/storage';
import { AppThunk } from 'framework-ui/src/types';
import { getFormData, getToken, getUserId } from 'framework-ui/src/utils/getters';
import { postSignOut } from 'frontend/src/api/authorization';
import {
    forgotPassword as forgotPasswordApi,
    updateUserNoMessage as updateUserNoMessageApi,
} from '../../../api/userApi';
import { accessTokensActions } from '../accessTokens';
import { devicesActions } from './devices';
import { discoveryActions } from './discovery';
import { thingHistoryActions } from './thingHistory';
import { userNamesActions } from './userNames';

export const userActions = {
    ...userAct,
    // getAuthChallenge(): AppThunk<Promise<boolean>> {
    //     return function (dispatch) {
    //         return getAuthChallengeApi(
    //             {
    //                 onSuccess: (json) => {
    //                     return json;
    //                 },
    //             },
    //             dispatch
    //         );
    //     };
    // },
    registerToken(token: string): AppThunk<Promise<boolean | void>> {
        return async function (dispatch, getState) {
            const FIREBASE_ADD = 'FIREBASE_ADD';
            logger.info(FIREBASE_ADD);

            if (!token) {
                dispatch(
                    notificationsActions.add({
                        message: ErrorMessages.getMessage('notificationsDisabled'),
                        variant: 'error',
                        duration: 3000,
                    })
                );
                return;
            }

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
    },

    forgot(FORM_NAME: string): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            logger.info(FORM_NAME);

            const result = dispatch(formsDataActions.validateForm(FORM_NAME));
            const formData = getFormData(FORM_NAME)(getState());
            if (result.valid) {
                return forgotPasswordApi(
                    {
                        body: { formData: { [FORM_NAME]: formData } },
                        onSuccess: () => {
                            dispatch(formsDataActions.removeForm(FORM_NAME));
                        },
                    },
                    dispatch
                );
            }
            return false;
        };
    },

    logOut(): AppThunk {
        return async function (dispatch, getState) {
            postSignOut(
                {
                    token: getToken(getState()),
                },
                dispatch
            );

            dispatch(userAct.logout());
            dispatch(devicesActions.toDefault());
            dispatch(userNamesActions.toDefault());
            dispatch(accessTokensActions.toDefault());
            dispatch(usersActions.toDefault());
            dispatch(discoveryActions.toDefault());
            dispatch(thingHistoryActions.toDefault());
            dispatch(formsDataActions.toDefault());
            // dispatch(
            //     notificationsActions.add({
            //         message: SuccessMessages.getMessage('successfullySignedOut'),
            //         variant: 'success',
            //         duration: 3000,
            //     })
            // );
            removeItem(STATE_DEHYDRATED);
        };
    },
};
