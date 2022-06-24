import { STATE_DEHYDRATED } from 'framework-ui/src/constants/redux';
import errorMessages from 'framework-ui/src/localization/errorMessages';
import { logger } from 'framework-ui/src/logger';
import { removeItem } from 'framework-ui/src/storage';
import { head, prop } from 'ramda';
import { postSignOut } from 'src/api/authorization';
import { dehydrateState } from 'framework-ui/src/redux/actions';
import {
    create as createUserApi,
    getUserAuthType as getUserAuthTypeApi,
    login as loginApi,
    updateUser as updateUserApi,
} from '../../../../../frontend/src/api/userApi';
import {
    forgotPassword as forgotPasswordApi,
    updateUserNoMessage as updateUserNoMessageApi,
} from '../../../api/userApi';
import { AppThunk } from '../../../types';
import { getFormData, getToken } from 'framework-ui/src/utils/getters';
import { authorizationReducerActions } from 'framework-ui/src/redux/reducers/application/authorization';
import { userReducerActions } from '../../reducers/application/user';
import { accessTokensActions } from '../accessTokens';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { devicesActions } from './devices';
import { discoveryActions } from './discovery';
import { notificationsActions } from 'framework-ui/src/redux/actions/application/notifications';
import { thingHistoryActions } from './thingHistory';
import { userNamesActions } from './userNames';
import { usersActions } from './users';
import { getUserId } from 'src/utils/getters';

const LOGIN = 'LOGIN';

export const userActions = {
    ...userReducerActions,
    registerToken(token: string): AppThunk<Promise<boolean | void>> {
        return async function (dispatch, getState) {
            const FIREBASE_ADD = 'FIREBASE_ADD';
            logger.info(FIREBASE_ADD);

            if (!token) {
                dispatch(
                    notificationsActions.add({
                        message: errorMessages.getMessage('notificationsDisabled'),
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

            dispatch(userActions.logout());
            dispatch(devicesActions.toDefault());
            dispatch(userNamesActions.toDefault());
            dispatch(accessTokensActions.toDefault());
            dispatch(usersActions.toDefault());
            dispatch(discoveryActions.toDefault());
            dispatch(thingHistoryActions.toDefault());
            dispatch(formsDataActions.toDefault());
            removeItem(STATE_DEHYDRATED);
        };
    },
    login(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const result = dispatch(formsDataActions.validateRegisteredFields(LOGIN));
            logger.info(LOGIN);
            if (result.valid) {
                const formData = getFormData(LOGIN)(getState());
                return loginApi(
                    {
                        body: { formData: { LOGIN: formData } },

                        onSuccess: (json: any) => {
                            dispatch(userActions.set({ ...json.user }));
                            dispatch(authorizationReducerActions.setAccessToken(json.token));
                            dispatch(authorizationReducerActions.setLoggedIn(true));
                            dispatch(dehydrateState());
                            // dispatch(resetForm(LOGIN)())
                        },
                    },
                    dispatch
                );
            }

            return false;
        };
    },

    logout(): AppThunk {
        return function (dispatch, getState) {
            dispatch(authorizationReducerActions.setAccessToken(''));
            dispatch(authorizationReducerActions.setLoggedIn(false));
            dispatch(userActions.toDefault());
        };
    },

    register(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const REGISTRATION = 'REGISTRATION';
            logger.info(REGISTRATION);
            const result = dispatch(formsDataActions.validateRegisteredFields(REGISTRATION));
            if (result.valid) {
                const formData = getFormData(REGISTRATION)(getState());
                return createUserApi(
                    {
                        body: { formData: { [REGISTRATION]: formData } },

                        onSuccess: () => {
                            // dispatch(formsDataActions.resetForm(REGISTRATION));
                        },
                    },
                    dispatch
                );
            }
            return false;
        };
    },

    registerAngLogin(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const REGISTRATION = 'REGISTRATION';
            logger.info('REGISTER_AND_LOGIN');
            const result = dispatch(formsDataActions.validateRegisteredFields(REGISTRATION));
            if (result.valid) {
                const formData = getFormData(REGISTRATION)(getState());
                return createUserApi(
                    {
                        body: { formData: { [REGISTRATION]: formData } },
                        onSuccess: (json: any) => {
                            dispatch(userActions.set({ ...json.user }));
                            dispatch(authorizationReducerActions.setAccessToken(json.token));
                            dispatch(authorizationReducerActions.setLoggedIn(true));
                            dispatch(dehydrateState());
                        },
                    },
                    dispatch
                );
            }
            return false;
        };
    },

    fetchAuthType(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const result = dispatch(formsDataActions.validateField('LOGIN.userName', true));
            logger.info('FETCH_AUTH_TYPE');
            if (result.valid) {
                // @ts-ignore
                const userName = prop('userName', getFormData(LOGIN)(getState()));
                return getUserAuthTypeApi(
                    {
                        userName: userName,
                        params: { attribute: 'authType' },
                        onSuccess: ({ authTypes }: any) => {
                            dispatch(
                                formsDataActions.setFormField({
                                    deepPath: `${LOGIN}.authType`,
                                    value: authTypes.find((it: any) => it === 'passwd') || head(authTypes),
                                })
                            );
                        },
                        onError: () => {
                            dispatch(formsDataActions.setFormField({ deepPath: `${LOGIN}.authType`, value: '' }));
                        },
                    },
                    dispatch
                );
            }
            return false;
        };
    },

    updateUser(id: any): AppThunk<Promise<Boolean>> {
        return async function (dispatch, getState) {
            const EDIT_USER = 'EDIT_USER';
            logger.info('EDIT_USER_CURRENT');

            const result = dispatch(formsDataActions.validateForm(EDIT_USER));
            const formData: any = getFormData(EDIT_USER)(getState());
            if (result.valid) {
                return updateUserApi(
                    {
                        token: getToken(getState()),
                        body: { formData: { [EDIT_USER]: formData } },
                        id,
                        onSuccess: () => {
                            const { auth, ...userObject } = formData;
                            dispatch(userActions.update({ _id: id, ...userObject }));
                            dispatch(
                                formsDataActions.setFormField({ deepPath: `${EDIT_USER}.auth.password`, value: '' })
                            );
                            dispatch(dehydrateState());
                        },
                    },
                    dispatch
                );
            }

            return false;
        };
    },
};
