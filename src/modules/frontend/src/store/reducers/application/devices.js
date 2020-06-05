import { handleActions } from 'redux-actions'
import { assoc, append, mergeDeepRight, findIndex, propEq, filter, clone } from 'ramda'
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
          const deviceID = action.payload
          return { data: filter(({ id }) => id !== deviceID, state.data), lastFetch: state.lastFetch }
     }
}

const update = {
     next({ data, lastFetch }, action) {
          const updateData = action.payload
          const devPos = findIndex(propEq('id', updateData.id))(data);
          data[devPos] = mergeDeepRight(data[devPos], updateData);
          return { lastFetch, data: data }
     }
}

const updateAll = {
     next({ lastFetch, data }, action) {
          const updateData = action.payload
          const newData = clone(data)
          updateData.forEach(({ id: updateId, control, ack }) => {
               const i = data.findIndex(({ id }) => updateId === id)

               if (i >= 0) {
                    newData[i].control = control
                    newData[i].ack = ack
               }
          })

          return { lastFetch, data: newData }
     }
}

const deviceReducers = {
     [ActionTypes.ADD_DEVICE]: add,
     [ActionTypes.SET_DEVICES]: set,
     [ActionTypes.REMOVE_DEVICE]: remove,
     [ActionTypes.UPDATE_DEVICE]: update,
     [ActionTypes.UPDATE_DEVICES]: updateAll
}

export default handleActions(deviceReducers, {})
