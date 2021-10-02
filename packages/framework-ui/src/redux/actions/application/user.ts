import { ActionTypes } from '../../../constants/redux';
import { getFormData, getToken } from '../../../utils/getters';
import {
    create as createUserApi,
    login as loginApi,
    getUserAuthType as getUserAuthTypeApi,
    updateUser as updateUserApi,
} from '../../../api/userApi';
import SuccessMessages from '../../../localization/successMessages';
import { dehydrateState } from '..';
import { prop, head } from 'ramda';
import { logger } from '../../../logger';
import { AppThunk } from '../../../types';
import { userReducerActions } from '../../reducers/application/user';
import { formsDataActions } from '../formsData';
import { notificationsActions } from './notifications';
import { authorizationReducerActions } from '../../reducers/application/authorization';

const LOGIN = 'LOGIN';

export const userActions = {
    ...userReducerActions,

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
