import { NOTIFY_TYPES } from 'frontend/src/constants'
import shouldSend from '../../utils/shouldSend'

function below(value, limit, interval, tmp) {
    return value < limit && shouldSend(interval, tmp)
}

function over(value, limit, interval, tmp) {
    return value > limit && shouldSend(interval, tmp)
}

function change(value, limit, interval, tmp) {
    return value !== tmp.lastValue
}

function always(value, limit, interval, tmp) {
    return true
}

export default {
    [NOTIFY_TYPES.BELOW]: below,
    [NOTIFY_TYPES.OVER]: over,
    [NOTIFY_TYPES.CHANGE]: change,
    [NOTIFY_TYPES.ALWAYS]: always,
}