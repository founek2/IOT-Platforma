import { ActionTypes } from '../../constants/redux';
import { merge } from 'ramda';

const updateHistory = {
    next(state, action) {
        return merge(state, action.payload);
    },
};

const setHistory = {
    next(state, action) {
        return action.payload;
    },
};

export const historyReducers = {
    [ActionTypes.UPDATE_HISTORY]: updateHistory,
    [ActionTypes.SET_HISTORY]: setHistory,
};
