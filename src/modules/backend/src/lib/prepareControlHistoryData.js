import { CONTROL_TYPES } from 'frontend/src/constants'
import { isDay as isDayFn } from '../lib/util'

const isNumber = (val) => !isNaN(val)

export default function (state, JSONkey, { recipe }, updateTime) {
    const query = {
        update: {},
        sum: {},
        min: {},
        max: {}
    }
    const isDay = isDayFn(updateTime)
    const { type } = recipe.find(({ JSONkey: key }) => JSONkey === key)

    transformFn[type](state, updateTime, query, isDay)


    return query
}

const transformFn = {
    [CONTROL_TYPES.SWITCH]: transformGeneral,
    [CONTROL_TYPES.ACTIVATOR]: transformGeneral,
    [CONTROL_TYPES.RGBSWITCH]: transformGeneral,
}

function transformGeneral(state, updateTime, query, isDay) {
    query.update["timestamps"] = updateTime
    Object.keys(state).forEach(key => {
        query.update[`samples`] = state

        if (isNumber(state[key])) {
            query.min[`min.${key}`] = state[key];
            query.max[`max.${key}`] = state[key]
            if (isDay) {    // day
                query.sum[`sum.day.${key}`] = state[key]
            } else {   // night
                query.sum[`sum.night.${key}`] = state[key]
            }
        }
    })

    return query
}