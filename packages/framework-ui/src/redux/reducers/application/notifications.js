import { handleActions } from 'redux-actions';
import { prop, propEq, filter, append, o, not } from 'ramda';
import { actionTypes } from '../../../constants/redux';

const addNot = {
    next(state, action) {
        const timeStamp = new Date().getTime();
        const updatedState = append({ key: timeStamp, ...action.payload }, state)

        return updatedState;
    }
};

const removeNot = {
    next(state, action) {
        return filter(o(not, propEq("key", action.payload)), state)
    }
}

const userReducers = {
    [actionTypes.ADD_NOTIFICATION]: addNot,
    [actionTypes.REMOVE_NOTIFICATION]: removeNot,
};

export default handleActions(userReducers, []);