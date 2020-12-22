import { handleActions } from 'redux-actions';
import { append, filter, prop, forEach, map, merge, contains } from 'ramda';
import { actionTypes } from '../../../constants/redux';

const setUsers = {
     next(state, action) {
          return action.payload;
     }
};

const willRemove = arrayofIDs => userObj => !contains(prop('id', userObj), arrayofIDs);

const removeUsers = {
     next(state, action) {
          const newState = filter(willRemove(action.payload), state);
          return newState;
     }
};

const add = {
     next(state, action) {
          const newState = append(action.payload, state);
          return newState;
     }
};

const updateUsers = {
     next(state, action) {
          let newState = state;
          action.payload.forEach(userUpdate => {
               const updateUser = userObj => {
                    if (userObj.id === userUpdate.id) {
                         return merge(userObj, userUpdate);
                    }
                    return userObj;
               };
               newState = map(updateUser, state);
          });

          return newState;
     }
};

const addPositions = {
     next(state, action) {
          const docs = action.payload; // [{id: "", positions: []}]
          let newState = filter(willRemove(action.payload), state);

          forEach(function (doc) {
               newState = append(doc, newState);
          }, docs);
          return newState;
     }
};

const userReducers = {
     [actionTypes.SET_USERS]: setUsers,
     [actionTypes.REMOVE_USERS]: removeUsers,
     [actionTypes.ADD_USER]: add,
     [actionTypes.UPDATE_USERS]: updateUsers,
     [actionTypes.ADD_POSITIONS]: addPositions
};

export default handleActions(userReducers, []);
