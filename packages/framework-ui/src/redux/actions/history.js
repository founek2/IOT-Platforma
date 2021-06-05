import { ActionTypes } from '../../constants/redux';
import { baseLogger } from '../../logger';

export function setHistory(data) {
    baseLogger(ActionTypes.SET_HISTORY);

    return {
        type: ActionTypes.SET_HISTORY,
        payload: data,
    };
}

export function updateHistory(data) {
    baseLogger(ActionTypes.UPDATE_HISTORY);

    return {
        type: ActionTypes.UPDATE_HISTORY,
        payload: data,
    };
}
