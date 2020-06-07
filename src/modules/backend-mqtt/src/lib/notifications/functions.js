import { NOTIFY_TYPES } from 'frontend/src/constants'
import shouldSend from '../../utils/shouldSend'

function below(value, limit, interval, tmp) {
    const ruleSatisfied = value < limit
    return {
        ruleSatisfied,
        valid: ruleSatisfied && shouldSend(interval, tmp)
    }
}

function over(value, limit, interval, tmp) {
    const ruleSatisfied = value > limit
    return {
        ruleSatisfied,
        valid: ruleSatisfied && shouldSend(interval, tmp)
    }
}

function always(value, limit, interval, tmp) {
    return {
        ruleSatisfied: true,
        valid: true
    }
}

export default {
    [NOTIFY_TYPES.BELOW]: below,
    [NOTIFY_TYPES.OVER]: over,
    [NOTIFY_TYPES.ALWAYS]: always,
}