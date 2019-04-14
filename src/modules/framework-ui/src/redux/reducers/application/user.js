import { handleActions } from 'redux-actions';
import {merge} from 'ramda';
import { actionTypes } from '../../../constants/redux';

const setUser = {
     next(state, action) {
          return action.payload
     }
};

const updateUser = {
	next(state, action) {
		const updateUser = merge(state, action.payload);
          return updateUser
     }
};

const logOutUser = {
	next(state, action) {
          return {loggedIn: false}
     }
}



const userReducers = {
	[actionTypes.SET_USER]: setUser,
	[actionTypes.UPDATE_USER]: updateUser,
	[actionTypes.LOG_OUT_USER]: logOutUser,
};

export default handleActions(userReducers, {});