import { ActionTypes } from '../../constants/redux';
import { merge } from 'ramda';

const update = {
    next(state, action) {
        return merge(state, action.payload);
    },
};

const set = {
    next(state, action) {
        return action.payload;
    },
};

export const tmpDataReducers = {
    [ActionTypes.UPDATE_TMP_DATA]: update,
    [ActionTypes.SET_TMP_DATA]: set,
};
