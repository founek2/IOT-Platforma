import {
    create as createUserApi,
    deleteUser as deleteUserApi,
    getUsers as fetchUsers,
    updateUser as updateUserApi,
} from '../../../../../frontend/src/api/userApi';
import { logger } from 'framework-ui/src/logger';
import { AppThunk } from '../../../types';
import { getFormData, getToken } from 'framework-ui/src/utils/getters';
import { usersReducerActions } from '../../reducers/application/users';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';

export const usersActions = {
    ...usersReducerActions,

    fetchAll(): AppThunk<Promise<boolean>> {
        return function (dispatch, getState) {
            return fetchUsers(
                {
                    token: getToken(getState()),
                    params: {},
                    onSuccess: (json: any) => dispatch(usersActions.set(json.docs)),
                },
                dispatch
            );
        };
    },

    create(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const USER = 'USER';
            const result = dispatch(formsDataActions.validateForm(USER));
            if (result.valid) {
                const state = getState();
                const formData = getFormData(USER)(state);
                return createUserApi(
                    {
                        body: { formsData: { [USER]: formData } },
                        token: getToken(state),
                        onSuccess: (json: any) => {
                            dispatch(usersActions.add(json.user));
                            dispatch(formsDataActions.resetForm(USER));
                        },
                    },
                    dispatch
                );
            }

            return false;
        };
    },

    updateUser(id: any): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const EDIT_USER = 'EDIT_USER';
            logger.info(EDIT_USER);

            const result = dispatch(formsDataActions.validateForm(EDIT_USER));
            const formData = getFormData(EDIT_USER)(getState());
            if (result.valid) {
                return updateUserApi(
                    {
                        token: getToken(getState()),
                        body: { formData: { [EDIT_USER]: formData } },
                        id,
                        onSuccess: () => {
                            const { auth, user } = formData;
                            dispatch(usersActions.updateMultiple([{ _id: id, ...user }]));
                            dispatch(
                                formsDataActions.setFormField({ deepPath: `${EDIT_USER}.auth.password`, value: '' })
                            );
                        },
                    },
                    dispatch
                );
            }

            return false;
        };
    },

    deleteUsers(): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const USER_MANAGEMENT = 'USER_MANAGEMENT';
            const result = dispatch(formsDataActions.validateForm(USER_MANAGEMENT));
            if (result.valid) {
                const formData: any = getFormData(USER_MANAGEMENT)(getState());
                formData.selected.map((id: any) => {
                    return deleteUserApi(
                        {
                            token: getToken(getState()),
                            id,
                            onSuccess: () => dispatch(usersActions.remove(id)),
                        },
                        dispatch
                    );
                });
            }

            return false;
        };
    },
};
