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
import { prop } from 'ramda';
import logger from '../../../logger';
import { AppThunk } from '../../../types';
import { userReducerActions } from '../../reducers/application/user';
import { formsDataActions } from '../formsData';
import { notificationsActions } from './notifications';

const LOGIN = 'LOGIN';

export const userActions = {
    ...userReducerActions,

    login(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const result = dispatch(formsDataActions.validateRegisteredFields(LOGIN));
            logger.log(LOGIN);
            if (result.valid) {
                const formData = getFormData(LOGIN)(getState());
                return loginApi(
                    {
                        body: { formData: { LOGIN: formData } },

                        onSuccess: (json: any) => {
                            console.log('logger', json);
                            dispatch(userActions.set({ ...json.user, token: json.token }));
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

    register(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const REGISTRATION = 'REGISTRATION';
            logger.log(REGISTRATION);
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
            logger.log('REGISTER_AND_LOGIN');
            const result = dispatch(formsDataActions.validateRegisteredFields(REGISTRATION));
            if (result.valid) {
                const formData = getFormData(REGISTRATION)(getState());
                return createUserApi(
                    {
                        body: { formData: { [REGISTRATION]: formData } },
                        onSuccess: (json: any) => {
                            dispatch(userActions.set({ ...json.user, token: json.token }));
                            // dispatch(formsDataActions.resetForm(REGISTRATION));
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
            logger.log('FETCH_AUTH_TYPE');
            if (result.valid) {
                // @ts-ignore
                const userName = prop('userName', getFormData(LOGIN)(getState()));
                return getUserAuthTypeApi(
                    {
                        userName: userName,
                        params: { attribute: 'authType' },
                        onSuccess: ({ authType }: any) => {
                            dispatch(formsDataActions.setFormField({ deepPath: `${LOGIN}.authType`, value: authType }));
                        },
                        onError: () => {
                            console.log('onError');
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
            logger.log('EDIT_USER_CURRENT');

            console.log('onSuccess0');
            const result = dispatch(formsDataActions.validateForm(EDIT_USER));
            console.log('onSuccess1');
            const formData = getFormData(EDIT_USER)(getState());
            console.log('onSuccess2');
            if (result.valid) {
                return updateUserApi(
                    {
                        token: getToken(getState()),
                        body: { formData: { [EDIT_USER]: formData } },
                        id,
                        onSuccess: () => {
                            dispatch(userActions.update(formData as any));
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
