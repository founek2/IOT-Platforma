import { handleActions } from 'redux-actions'
import { adjust, lensProp, assoc, append, mergeDeepRight, findIndex, propEq } from 'ramda'
import { ActionTypes } from '../../../constants/redux'

const add = {
     next(state, action) {
          const data = append(action.payload, state.data)
          return assoc('data', data, state)
     }
}

const set = {
     next(state, action) {
          return { data: action.payload, lastFetch: new Date() }
     }
}

const remove = {
     next(state, action) {
          throw Error('unsuported')
          //return dissoc(action.payload, state)
          return state
     }
}

const update = {
     next({data, lastFetch}, action) {
          const updateData = action.payload
		const devPos = findIndex(propEq('id', updateData.id))(data);
		data[devPos] = mergeDeepRight(data[devPos], updateData);
          return {lastFetch, data: data}
     }
}

const userReducers = {
     [ActionTypes.ADD_DEVICE]: add,
     [ActionTypes.SET_DEVICES]: set,
     [ActionTypes.REMOVE_DEVICE]: remove,
     [ActionTypes.UPDATE_DEVICE]: update
}

export default handleActions(userReducers, {})
