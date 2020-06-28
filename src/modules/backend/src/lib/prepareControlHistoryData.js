import { CONTROL_TYPES } from 'frontend/src/constants'
import { isDay as isDayFn } from '../lib/util'

export default function (state, JSONkey, { recipe }, updateTime) {
    const query = {
        update: {},
    }
    const isDay = isDayFn(updateTime)
    const { type } = recipe.find(({ JSONkey: key }) => JSONkey === key)

    transformFn[type](state, updateTime, query, isDay)


    return query
}

const transformFn = {
    [CONTROL_TYPES.SWITCH]: transformGeneral,
    [CONTROL_TYPES.ACTIVATOR]: transformGeneral,
    [CONTROL_TYPES.RGB_SWITCH]: transformGeneral,
}

function transformGeneral(state, updateTime, query, isDay) {
    query.update["timestamps"] = updateTime
    Object.keys(state).forEach(key => {
        query.update[`samples`] = state
    })

    return query
}