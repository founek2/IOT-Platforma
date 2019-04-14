import { actionTypes, POSITION_UPDATE_INTERVAL } from '../../../constants/redux';
import { getFormData, getToken, getUsers } from '../../../utils/getters';
import { create as createUserApi, login as loginApi, getUsers as fetchUsers, deletedUsers, updateUser, getUsersActiveBefore as apiGetUsersActiveBefore } from '../../../api/userApi';
import { validateForm, resetForm } from '../formsData';
import objectDiff from '../../../utils/objectDiff';
import {omit, mapObjIndexed, head, isEmpty} from 'ramda'
import { addNotification } from './notifications';
import InfoMessages from '../../../localization/infoMessages';

export function remove(data) {
     return {
          type: actionTypes.REMOVE_USERS,
          payload: data
     };
}

export function set(data) {
     return {
          type: actionTypes.SET_USERS,
          payload: data
     };
}

export function add(data) {
     return {
          type: actionTypes.ADD_USER,
          payload: data
     };
}

export function fetchAll() {
     return function(dispatch, getState) {
          return fetchUsers(
               {
                    token: getToken(getState()),
                    onSuccess: json => dispatch(set(json.users))
               },
               dispatch
          );
     };
}

export function create() {
     return function(dispatch, getState) {
          const USER = 'USER';
          const result = dispatch(validateForm(USER)());
          if (result.valid) {
               const state = getState();
               const formData = getFormData(USER)(state);
               return createUserApi(
                    {
                         body: { formsData: { [USER]: formData } },
                         token: getToken(state),
                         onSuccess: json => {
						dispatch(add(json.user))
                              dispatch(resetForm(USER)());
                         }
                    },
                    dispatch
               );
          }
     };
}

export function updateUsers(arrayWithUsers) {
	return {
          type: actionTypes.UPDATE_USERS,
          payload: arrayWithUsers
     };
}

export function update(id) {
     return function(dispatch, getState) {
		const USER = 'USER';
		const ignoreRequiredFields = {password: true}
          const result = dispatch(validateForm(USER, ignoreRequiredFields)());
          if (result.valid) {
               const state = getState();
			const formData = getFormData(USER)(state);
			const targetUser = getUsers(state).find(user => user.id === id);
			const cleanedUser = omit(["created", "id"], targetUser);
			const diff = objectDiff(formData, cleanedUser);
			const filteredFormData = mapObjIndexed(head,diff)
			console.log("filtered diff", filteredFormData)
			if (isEmpty(filteredFormData)) {
				dispatch(addNotification({ message: InfoMessages.getMessage('noneChangeFound'), variant: 'info', duration: 3000 }))
			} else {
				const formDataWithID = {...filteredFormData, id: targetUser.id};
				return updateUser(
					{
						body: { formsData: { [USER]: formDataWithID } },
						token: getToken(state),
						onSuccess: json => {
							dispatch(updateUsers([formDataWithID]))
						}
					},
					dispatch
				);
			}
          }
     };
}

export function deleteUsers() {
     return function(dispatch, getState) {
          const USER_MANAGEMENT = 'USER_MANAGEMENT';
          const result = dispatch(validateForm(USER_MANAGEMENT)());
          if (result.valid) {
               const formData = getFormData(USER_MANAGEMENT)(getState());
               return deletedUsers(
                    {
                         token: getToken(getState()),
                         body: { formData: { [USER_MANAGEMENT]: formData } },
                         onSuccess: json => dispatch(remove(formData.selected))
                    },
                    dispatch
               );
          }
     };
}

export function getActiveUsers() {
	return function(dispatch, getState) {
          apiGetUsersActiveBefore({
			token: getToken(getState()),
			params: {before: new Date().getTime() - POSITION_UPDATE_INTERVAL},
			onSuccess: json => dispatch(addPositions(json.docs))
		},
		dispatch)
     };
}

export function addPositions(docs) {
	return {
		type: actionTypes.ADD_POSITIONS,
          payload: docs
	}
}
export default{
	remove,
	set,
	fetchAll, 
	create,
	deletedUsers
}
