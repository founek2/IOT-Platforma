import { actionTypes } from '../../../constants/redux';
import { getFormData, getToken } from '../../../utils/getters';
import {
    create as createUserApi,
    getUsers as fetchUsers,
    deleteUser as deleteUserApi,
    updateUser as updateUserApi,
} from '../../../api/userApi';
import { validateForm, resetForm } from '../formsData';
import { baseLogger } from '../../../logger';

export function remove(data) {
    return {
        type: actionTypes.REMOVE_USER,
        payload: data,
    };
}

export function set(data) {
    return {
        type: actionTypes.SET_USERS,
        payload: data,
    };
}

export function add(data) {
    return {
        type: actionTypes.ADD_USER,
        payload: data,
    };
}

export function fetchAll() {
    return function (dispatch, getState) {
        return fetchUsers(
            {
                token: getToken(getState()),
                onSuccess: (json) => dispatch(set(json.docs)),
            },
            dispatch
        );
    };
}

export function create() {
    return async function (dispatch, getState) {
        const USER = 'USER';
        const result = dispatch(validateForm(USER)());
        if (result.valid) {
            const state = getState();
            const formData = getFormData(USER)(state);
            return createUserApi(
                {
                    body: { formsData: { [USER]: formData } },
                    token: getToken(state),
                    onSuccess: (json) => {
                        dispatch(add(json.user));
                        dispatch(resetForm(USER)());
                    },
                },
                dispatch
            );
        }
    };
}

export function updateUsers(arrayWithUsers) {
    return {
        type: actionTypes.UPDATE_USERS,
        payload: arrayWithUsers,
    };
}

export function updateUser(id) {
    return async function (dispatch, getState) {
        const EDIT_USER = 'EDIT_USER';
        baseLogger(EDIT_USER);

        const result = dispatch(validateForm(EDIT_USER)());
        const formData = getFormData(EDIT_USER)(getState());
        if (result.valid) {
            return updateUserApi(
                {
                    token: getToken(getState()),
                    body: { formData: { [EDIT_USER]: formData } },
                    id,
                    onSuccess: () => {
                        dispatch(updateUsers([formData]));
                    },
                },
                dispatch
            );
        }
    };
}

export function deleteUsers() {
    return async function (dispatch, getState) {
        const USER_MANAGEMENT = 'USER_MANAGEMENT';
        const result = dispatch(validateForm(USER_MANAGEMENT)());
        if (result.valid) {
            const formData = getFormData(USER_MANAGEMENT)(getState());
            formData.selected.map((id) => {
                return deleteUserApi(
                    {
                        token: getToken(getState()),
                        id,
                        onSuccess: () => dispatch(remove(id)),
                    },
                    dispatch
                );
            });
        }
    };
}

export default {
    remove,
    set,
    fetchAll,
    create,
};
