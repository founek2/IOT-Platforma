import { postJson, paramSender, deleteJson, putJson, patchJson } from '.'

const API_URL = '/api'

export const login = (object, dispatch) =>
     postJson({
          url: API_URL + '/user',
		...object,
		successMessage: "successfullyLoggedIn",
          dispatch
     })

export const create = (object, dispatch) =>
     postJson({
          url: API_URL + '/user',
		...object,
		successMessage: "userCreated",
          dispatch
     })

export const getUsers = (object, dispatch) =>
     paramSender({
          url: API_URL + '/users',
          ...object,
          dispatch
	})
	
export const getUserAuthType = ({userName, ...rest}, dispatch) =>
     paramSender({
		url: API_URL + `/user/${userName}`,
		...rest,
          dispatch
     })

export const getUsersActiveBefore = (object, dispatch) =>
     paramSender({
          url: API_URL + '/users/activeBefore',
          ...object,
          dispatch
     })

export const deletedUsers = (object, dispatch) =>
     deleteJson({
          url: API_URL + '/users',
          ...object,
          dispatch
     })

export const updateUser = ({id, ...object}, dispatch) => {
     putJson({
          url: API_URL + `/user/${id}`,
          ...object,
          successMessage: 'userUpdated',
          dispatch
     })
}


export const patchUser = ({id, ...object}, dispatch) => {
     patchJson({
          url: API_URL + `/user/${id}`,
          ...object,
          successMessage: 'userUpdated',
          dispatch
     })
}

