import { CONTROL_TYPES } from 'frontend/src/constants'
import { isDay as isDayFn } from '../lib/util'

const isNumber = (val) => !isNaN(val)

export default function (data, { recipe }, updateTime) {
    const query = {
        update: {},
        sum: {},
        min: {},
        max: {}
    }
    const isDay = isDayFn(updateTime)
    recipe.forEach(({ JSONkey, type }) => {
        const val = data[JSONkey]
        transformFn[type](val, JSONkey, updateTime, query, isDay)
    })

    return query
}

const transformFn = {
    [CONTROL_TYPES.SWITCH]: transformGeneral,
    [CONTROL_TYPES.ACTIVATOR]: transformGeneral,
    [CONTROL_TYPES.RGBSWITCH]: transformGeneral,
}

function transformGeneral(val, JSONkey, updateTime, query, isDay) {
    query.update["timestamps"] = updateTime
    Object.keys(val).forEach(key => {
        query.update[`samples.${JSONkey}`] = val

        if (isNumber(val[key])) {
            query.min[`min.${JSONkey}.${key}`] = val[key];
            query.max[`max.${JSONkey}.${key}`] = val[key]
            if (isDay) {    // day
                query.sum[`sum.day.${JSONkey}.${key}`] = val[key]
            } else {   // night
                query.sum[`sum.night.${JSONkey}.${key}`] = val[key]
            }
        }
    })

    return query
}