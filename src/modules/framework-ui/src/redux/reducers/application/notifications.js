import { handleActions } from 'redux-actions';
import { adjust, set, lensProp, merge } from 'ramda';
import { actionTypes } from '../../../constants/redux';

const openLens = lensProp('open');

function setOpen(bool) {
	return function (obj) {
		return set(openLens, bool, obj)
	}
}

const addNot = {
	next(state, action) {
		const timeStamp = new Date().getTime();
		const updatedState = merge(state, { [timeStamp]: { key: timeStamp, ...action.payload } })

		return updatedState;
	}
};

const closeNot = {
	next(state, action) {
		return adjust(setOpen(false), action.payload, state);
	}
}

const setNot = {
	next(state, action) {
		return action.payload;
	}
}

const removeNot = {
	next(state, action) {

		//return dissoc(action.payload, state)
		return state;
	}
}

const userReducers = {
	[actionTypes.ADD_NOTIFICATION]: addNot,
	[actionTypes.CLOSE_NOTIFICATION]: closeNot,
	[actionTypes.SET_NOTIFICITAION]: setNot,
	[actionTypes.REMOVE_NOTIFICATION]: removeNot,
};

export default handleActions(userReducers, {});