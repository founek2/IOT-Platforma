import { actionTypes } from '../../constants/redux';
import { baseLogger } from '../../logger'

export function setHistory(data) {
    baseLogger(actionTypes.SET_HISTORY)

    return {
        type: actionTypes.SET_HISTORY,
        payload: data
    };
}

export function updateHistory(data) {
    baseLogger(actionTypes.UPDATE_HISTORY)

    return {
        type: actionTypes.UPDATE_HISTORY,
        payload: data
    };
}