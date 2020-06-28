import { ActionTypes } from '../../../constants/redux'
import { handleActions } from 'redux-actions'

const set = {
    next(state, action) {
        console.log("setting")
        return { data: action.payload, lastFetch: new Date() }
    }
}

// const update = {
//     next(state, action) {
//          return { data: merge(state, action.payload), lastFetch: new Date() }
//     }
// }

const sensorsReducers = {
    [ActionTypes.SET_USER_NAMES]: set,
    // [ActionTypes.UPDATE_USER_NAMES]: update
}
export default handleActions(sensorsReducers, {})