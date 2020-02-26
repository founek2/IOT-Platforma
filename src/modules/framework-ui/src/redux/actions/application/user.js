import { actionTypes, POSITION_UPDATE_INTERVAL } from '../../../constants/redux'
import { getFormData, getToken } from '../../../utils/getters'
import {
     create as createUserApi,
     login as loginApi,
     sendActive as apiActive,
     getUserAuthType as getUserAuthTypeApi,
} from '../../../api/userApi'
import { resetForm, updateFormField, validateRegisteredFields } from '../formsData'
import { addNotification } from './notifications'
import SuccessMessages from '../../../localization/successMessages'
import { dehydrateState } from '../'
import { prop } from 'ramda'
import LoginCallbacks from '../../../callbacks/login'
import LogoutCallbacks from '../../../callbacks/login'

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
          const result = dispatch(validateRegisteredFields(LOGIN)())
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

export default {
     setUser,
     login,
     update
}
