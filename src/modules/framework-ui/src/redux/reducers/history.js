import { actionTypes } from '../../constants/redux';
import {merge} from 'ramda';

const updateHistory = {
     next(state, action) {
          return merge(state, action.payload);
     }
};

const setHistory = {
	next(state, action) {
          return action.payload;
     }
}

export const historyReducers=  {
	[actionTypes.UPDATE_HISTORY]: updateHistory,
	[actionTypes.SET_HISTORY]: setHistory,
}
