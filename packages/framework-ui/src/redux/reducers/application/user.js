import { handleActions } from 'redux-actions';
import { merge } from 'ramda';
import { ActionTypes } from '../../../constants/redux';

const setUser = {
    next(state, action) {
        return action.payload;
    },
};

const updateUser = {
    next(state, action) {
        const updateUser = merge(state, action.payload);
        return updateUser;
    },
};

const logOutUser = {
    next(state, action) {
        return { loggedIn: false };
    },
};

const userReducers = {
    [ActionTypes.SET_USER]: setUser,
    [ActionTypes.UPDATE_USER]: updateUser,
    [ActionTypes.LOG_OUT_USER]: logOutUser,
};

export default handleActions(userReducers, {});
