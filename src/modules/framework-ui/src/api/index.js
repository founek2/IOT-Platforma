import { merge, flip, o, toPairs, forEach } from 'ramda'
import { addNotification } from '../redux/actions/application/notifications'
import ErrorMessages from '../localization/errorMessages'
import SuccessMessages from '../localization/successMessages'
import { warningLog, infoLog } from '../Logger'
import { update } from '../redux/actions/application/user'
import { dehydrateState } from '../redux/actions/'

const processResponse = (dispatch, successMessage) => response => {
     const { status } = response
     // set new jwt token, when provided from backend
     const newToken = response.headers.get("authorization-jwt-new")
     if (newToken) {
          infoLog("Setting resigned token")
          dispatch(update({ token: newToken }))
          dispatch(dehydrateState())
     }

     if (status === 500) {
          dispatch(addNotification({ message: ErrorMessages.getMessage('unexpectedError'), variant: 'error', duration: 3000 }))
          throw new Error('breakChain')
     } else if (status === 404) {
          dispatch(addNotification({ message: ErrorMessages.getMessage('unavailableBackend'), variant: 'error', duration: 3000 }))
          throw new Error('breakChain')
     } else if (status === 413) {
          dispatch(addNotification({ message: ErrorMessages.getMessage('payloadTooLarge'), variant: 'error', duration: 3000 }))
          throw new Error('breakChain')
     } else if (status === 204) {

          if (successMessage)
               return dispatch(
                    addNotification({
                         message: SuccessMessages.getMessage(successMessage),
                         variant: 'success',
                         duration: 3000
                    })
               )

     } else if (status !== 200 && status !== 208) { // 208 - my error code
          dispatch(addNotification({ message: ErrorMessages.getMessage('unexpectedError'), variant: 'error', duration: 3000 }))
          throw new Error('breakChain')
     } else {
          return response.json().then(json => {
               const { message, dontShow } = json
               if (!dontShow) {
                    if (status === 208) {
                         const { error } = json
                         dispatch(addNotification({ message: ErrorMessages.getMessage(error), variant: 'error', duration: 3000 }))
                         // throw new Error('breakChain');
                         throw new Error(message)
                    } else if (successMessage) {
                         dispatch(
                              addNotification({
                                   message: SuccessMessages.getMessage(successMessage),
                                   variant: 'success',
                                   duration: 3000
                              })
                         )
                    }
                    return json
               }
          })
     }
}

const checkError = Fn => error => {
     warningLog('API catch> ' + error)
     if (error.message !== 'breakChain' && Fn) Fn(error)
}

function buildParams(params) {
     let result = '?'
     if (params) {
          const toString = ([key, value]) => {
               result += key + '=' + value + '&'
          }
          forEach(toString, toPairs(params))
     }
     return result.slice(0, -1)
}

export const jsonSender = async ({ url, token = '', onSuccess, onError, onFinish, method, body, dispatch, successMessage }) => {
     let catched = false
     try {
          const response = await fetch(url, {
               method,
               headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization-JWT': token
               },
               body: JSON.stringify(body)
          })
          const json = await processResponse(dispatch, successMessage)(response)
          if (onSuccess) onSuccess(json)
     } catch (e) {
          checkError(onError)(e)
          catched = true;
     }
     onFinish && onFinish()
     return !catched;
}

export const paramSender = async ({ url, token = '', onSuccess, onError, onFinish, method = 'GET', dispatch, params }) => {
     let catched = false
     try {
          const response = await fetch(url + (params ? buildParams(params) : ''), {
               method,
               headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization-JWT': token
               }
          })
          const json = await processResponse(dispatch)(response)
          onSuccess(json)
     } catch (e) {
          catched = true
          checkError(onError)(e)
     }
     onFinish && onFinish()
     return !catched
}

export const postJson = o(jsonSender, flip(merge)({ method: 'POST' }))

export const putJson = o(jsonSender, flip(merge)({ method: 'PUT' }))

export const deleteJson = o(jsonSender, flip(merge)({ method: 'DELETE' }))

export const patchJson = o(jsonSender, flip(merge)({ method: 'PATCH' }))

export const getJson = o(jsonSender, flip(merge)({ method: 'GET' }))
