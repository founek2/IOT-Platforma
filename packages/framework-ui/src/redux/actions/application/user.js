import { actionTypes } from '../../../constants/redux'
import { getFormData, getToken } from '../../../utils/getters'
import {
    create as createUserApi,
    login as loginApi,
    getUserAuthType as getUserAuthTypeApi,
    updateUser as updateUserApi
} from '../../../api/userApi'
import { resetForm, updateFormField, validateRegisteredFields, validateField, validateForm } from '../formsData'
import { addNotification } from './notifications'
import SuccessMessages from '../../../localization/successMessages'
import { dehydrateState } from '../'
import { prop } from 'ramda'
import LoginCallbacks from '../../../callbacks/login'
import LogoutCallbacks from '../../../callbacks/login'
import logger from '../../../logger'

export function update(data) {
    return {
        type: actionTypes.UPDATE_USER,
        payload: data
    }
}

const LOGIN = 'LOGIN'

export function login() {
    return async function (dispatch, getState) {
        const result = dispatch(validateRegisteredFields(LOGIN)())
        logger.log(LOGIN)
        if (result.valid) {
            const formData = getFormData(LOGIN)(getState())
            return loginApi(
                {
                    body: { formData: { LOGIN: formData } },

                    onSuccess: json => {
                        dispatch(setUser({ ...json.user, token: json.token }))
                        dispatch(dehydrateState())
                        LoginCallbacks.exec(json.token)
                        // dispatch(resetForm(LOGIN)())
                    }
                },
                dispatch
            )
        }
    }
}

export function register() {
    return async function (dispatch, getState) {
        const REGISTRATION = 'REGISTRATION'
        logger.log(REGISTRATION)
        const result = dispatch(validateRegisteredFields(REGISTRATION)())
        if (result.valid) {
            const formData = getFormData(REGISTRATION)(getState())
            return createUserApi(
                {
                    body: { formData: { [REGISTRATION]: formData } },

                    onSuccess: json => {
                        dispatch(resetForm(REGISTRATION)())
                    }
                },
                dispatch
            )
        }
    }
}

export function registerAngLogin() {
    return async function (dispatch, getState) {
        const REGISTRATION = 'REGISTRATION'
        logger.log("REGISTER_AND_LOGIN")
        const result = dispatch(validateRegisteredFields(REGISTRATION)())
        if (result.valid) {
            const formData = getFormData(REGISTRATION)(getState())
            return createUserApi(
                {
                    body: { formData: { [REGISTRATION]: formData } },
                    onSuccess: json => {
                        dispatch(setUser({ ...json.user, token: json.token }))
                        dispatch(resetForm(REGISTRATION)())
                        dispatch(dehydrateState())
                        LoginCallbacks.exec(json.token)
                    }
                },
                dispatch
            )
        }
    }
}

export function setUser(data) {
    return {
        type: actionTypes.SET_USER,
        payload: data
    }
}

export function userLogOut() {
    return async function (dispatch) {
        dispatch({
            type: actionTypes.RESET_TO_DEFAULT
        })
        dispatch(
            addNotification({ message: SuccessMessages.getMessage('successfullyLogOut'), variant: 'success', duration: 3000 })
        )
        LogoutCallbacks.exec()
    }
}

export function fetchAuthType() {
    return async function (dispatch, getState) {
        const result = dispatch(validateField("LOGIN.userName", true))
        logger.log("FETCH_AUTH_TYPE")
        if (result.valid) {
            const userName = prop('userName', getFormData(LOGIN)(getState()))
            return getUserAuthTypeApi(
                {
                    userName: userName,
                    params: { attribute: 'authType' },
                    onSuccess: ({ authType }) => {
                        dispatch(updateFormField(`${LOGIN}.authType`, authType))
                    },
                    onError: () => dispatch(updateFormField(`${LOGIN}.authType`, ''))
                },
                dispatch
            )
        }
    }
}

export function updateUser(id) {
    return async function (dispatch, getState) {
        const EDIT_USER = 'EDIT_USER'
        logger.log("EDIT_USER_CURRENT")

        const result = dispatch(validateForm(EDIT_USER)())
        const formData = getFormData(EDIT_USER)(getState())
        if (result.valid) {
            return updateUserApi({
                token: getToken(getState()),
                body: { formData: { [EDIT_USER]: formData } },
                id,
                onSuccess: () => {
                    dispatch(update(formData))
                    dispatch(dehydrateState())
                }
            }, dispatch)
        }
    };
}

export default {
    setUser,
    login,
    update
}
