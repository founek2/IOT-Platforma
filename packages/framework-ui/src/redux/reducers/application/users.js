import { handleActions } from 'redux-actions';
import { append, filter, prop, not, map, merge, o, equals } from 'ramda';
import { ActionTypes } from '../../../constants/redux';

const setUsers = {
    next(state, action) {
        return action.payload;
    },
};

const filterById = (id) => (userObj) => o(not, equals(id))(prop('id', userObj));

const removeUser = {
    next(state, action) {
        const newState = filter(filterById(action.payload), state);
        return newState;
    },
};

const add = {
    next(state, action) {
        const newState = append(action.payload, state);
        return newState;
    },
};

const updateUsers = {
    next(state, action) {
        let newState = state;
        action.payload.forEach((userUpdate) => {
            const updateUser = (userObj) => {
                if (userObj.id === userUpdate.id) {
                    return merge(userObj, userUpdate);
                }
                return userObj;
            };
            newState = map(updateUser, state);
        });

        return newState;
    },
};

const userReducers = {
    [ActionTypes.SET_USERS]: setUsers,
    [ActionTypes.REMOVE_USER]: removeUser,
    [ActionTypes.ADD_USER]: add,
    [ActionTypes.UPDATE_USERS]: updateUsers,
};

export default handleActions(userReducers, []);
