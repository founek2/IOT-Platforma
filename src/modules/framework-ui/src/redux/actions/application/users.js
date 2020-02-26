import { actionTypes, POSITION_UPDATE_INTERVAL } from '../../../constants/redux';
import { getFormData, getToken, getUsers } from '../../../utils/getters';
import { create as createUserApi, login as loginApi, getUsers as fetchUsers, deletedUsers, updateUser as updateUserApi, getUsersActiveBefore as apiGetUsersActiveBefore } from '../../../api/userApi';
import { validateForm, resetForm } from '../formsData';
import objectDiff from '../../../utils/objectDiff';
import {omit, mapObjIndexed, head, isEmpty} from 'ramda'
import { addNotification } from './notifications';
import InfoMessages from '../../../localization/infoMessages';
import { baseLogger } from '../../../Logger'

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
     return async function(dispatch, getState) {
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

export function updateUser(id) {
     return async function(dispatch, getState) {
          const EDIT_USER = 'EDIT_USER'
          baseLogger(EDIT_USER)

          const result = dispatch(validateForm(EDIT_USER)())
          const formData = getFormData(EDIT_USER)(getState())
          console.log("validRes>", result)
          if (result.valid) {
               return updateUserApi({
                    token: getToken(getState()),
                    body: { formData: { [EDIT_USER]: formData } },
                    id,
                    onSuccess: () => {
                         // dispatch(update({ id, sensors, sampleInterval }))
                    }
               }, dispatch)
          }
     };
}

export function deleteUsers() {
     return async function(dispatch, getState) {
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

export default{
	remove,
	set,
	fetchAll, 
	create,
	deletedUsers
}
