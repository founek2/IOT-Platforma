import { actionTypes, POSITION_UPDATE_INTERVAL } from '../../../constants/redux'
import { getFormData, getToken } from '../../../utils/getters'
import {
     create as createUserApi,
     login as loginApi,
     sendActive as apiActive,
     getUserAuthType as getUserAuthTypeApi,
} from '../../../api/userApi'
import { validateForm, resetForm, updateFormField } from '../formsData'
import { addNotification } from './notifications'
import SuccessMessages from '../../../localization/successMessages'
import * as currenPosition from '../../../utils/currentPosition'
import { dehydrateState } from '../'
import { prop } from 'ramda'

export function update(data) {
     return {
          type: actionTypes.UPDATE_USER,
          payload: data
     }
}

const LOGIN = 'LOGIN'

export function login() {
     return function(dispatch, getState) {
		const result = dispatch(validateForm(LOGIN)())
		console.log("login")
          if (result.valid) {
               const formData = getFormData(LOGIN)(getState())
               return loginApi(
                    {
                         body: { formData: { LOGIN: formData } },

                         onSuccess: json => {
                              dispatch(setUser({ ...json.user, token: json.token }))
                              dispatch(resetForm(LOGIN)())
                              dispatch(dehydrateState())
                         }
                    },
                    dispatch
               )
          }
     }
}

export function register() {
     return function(dispatch, getState) {
          console.log('registrace')
          const REGISTRATION = 'REGISTRATION'
          const result = dispatch(validateForm(REGISTRATION)())
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
     return function(dispatch, getState) {
          const REGISTRATION = 'REGISTRATION'
          const result = dispatch(validateForm(REGISTRATION)())
          if (result.valid) {
               const formData = getFormData(REGISTRATION)(getState())
               return createUserApi(
                    {
                         body: { formData: { [REGISTRATION]: formData } },

                         onSuccess: json => {
                              dispatch(setUser({ ...json.user, token: json.token }))
                              dispatch(resetForm(REGISTRATION)())
                              dispatch(dehydrateState())
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
     return function(dispatch) {
          dispatch(
               addNotification({ message: SuccessMessages.getMessage('successfullyLogOut'), variant: 'success', duration: 3000 })
          )
          dispatch({
               type: actionTypes.RESET_TO_DEFAULT
          })
     }
}

export function fetchAuthType() {
     return function(dispatch, getState) {
          const userName = prop('userName', getFormData(LOGIN)(getState()))
          return getUserAuthTypeApi(
               {
                    userName: userName.trim(),
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

export function updateLastPosition() {
     return function(dispatch) {
          return dispatch(update({ lastPositionUpdate: new Date() }))
     }
}

export function sendCurrentPosition() {
     return function(dispatch, getState) {
          currenPosition.get(
               position => {
                    const { latitude, longitude } = position.coords
                    apiActive(
                         {
                              body: { formData: { POSITION: { latitude, longitude } } },
                              token: getToken(getState()),
                              onSuccess: json => dispatch(updateLastPosition())
                         },
                         dispatch
                    )
               },
               () => console.log('notFoundPosition')
          )
     }
}
let interval = null
export function enableSendingCurrPosition() {
     return function(dispatch) {
          dispatch(sendCurrentPosition())
          interval = setInterval(() => dispatch(sendCurrentPosition()), POSITION_UPDATE_INTERVAL)
     }
}

export function disableSendingCurrPosition() {
     return function(dispatch) {
          clearInterval(interval)
     }
}

export default {
     setUser,
     login,
     update
}
