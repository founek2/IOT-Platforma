import { prop, o, curry, compose, has, filter, equals, is } from 'ramda'
import getInPath from './getInPath'

export const getFormsData = prop('formsData')

export const getFieldDescriptors = prop('fieldDescriptors')

export const getFieldDescriptor = curry((deepPath, state) =>
     o(descriptors => {
          if (deepPath.match(/\.\d+$/)) deepPath = deepPath.replace(/\.\d+$/, '[]')
          return getInPath(deepPath)(descriptors)
     }, getFieldDescriptors)(state)
)

export const getRegisteredFields = o(prop('registeredFields'), getFormsData)

export const getRegisteredField = curry((deepPath, state) => o(getInPath(deepPath), getRegisteredFields)(state))

export const getPristine = compose(
     prop('pristine'),
     getRegisteredField
)

export const getFormData = formName => o(prop(formName), getFormsData)

export const getFormDescriptors = curry((formName, state) => o(prop(formName), getFieldDescriptors)(state))

export const getApplication = prop('application')

export const getNotifications = o(prop('notifications'), getApplication)

export const getUser = o(prop('user'), getApplication)

export const getUserAuthType = o(prop('authType'), getUser)

export const getUserInfo = o(prop('info'), getUser)

export const getGroups = o(prop('groups'), getUser)

export const getFieldVal = curry((deepPath, state) => o(getInPath(deepPath), getFormsData)(state))

export const getToken = o(prop('token'), getUser)

export const getUserPresence = state => !!getToken(state)

export const getUsers = o(prop('users'), getApplication)

export const getCities = state => o(prop('cities'), getApplication)(state)

export const getUserId = o(prop('id'), getUser)

export const getLastPosUpdate = o(prop('lastPositionUpdate'), getUser)

export const getUsersWithPosition = o(filter(has('positions')), getUsers)

export const getHistory = prop('history')

export const isUrlHash = hash =>
     compose(
          equals(hash),
          prop('hash'),
          getHistory
     )

export const getTmpData = prop('tmpData')

export const getDialogTmp = o(prop('dialog'), prop('tmpData'))
