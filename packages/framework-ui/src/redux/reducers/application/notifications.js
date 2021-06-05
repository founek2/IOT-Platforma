import { handleActions } from 'redux-actions';
import { prop, propEq, filter, append, o, not } from 'ramda';
import { ActionTypes } from '../../../constants/redux';

const addNot = {
    next(state, action) {
        const timeStamp = new Date().getTime();
        const updatedState = append({ key: timeStamp, ...action.payload }, state);

        return updatedState;
    },
};

const removeNot = {
    next(state, action) {
        return filter(o(not, propEq('key', action.payload)), state);
    },
};

const userReducers = {
    [ActionTypes.ADD_NOTIFICATION]: addNot,
    [ActionTypes.REMOVE_NOTIFICATION]: removeNot,
};

export default handleActions(userReducers, []);
