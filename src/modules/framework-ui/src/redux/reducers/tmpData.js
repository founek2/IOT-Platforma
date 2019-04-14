import { actionTypes } from '../../constants/redux';
import {merge} from 'ramda';

const update = {
     next(state, action) {
          return merge(state, action.payload);
     }
};

const set = {
	next(state, action) {
          return action.payload;
     }
}

export const tmpDataReducers=  {
	[actionTypes.UPDATE_TMP_DATA]: update,
	[actionTypes.SET_TMP_DATA]: set,
}
