import { ActionTypes } from '../../constants/redux';
import { baseLogger } from '../../logger';

export function setTmpData(data) {
    baseLogger(ActionTypes.SET_TMP_DATA);

    return {
        type: ActionTypes.SET_TMP_DATA,
        payload: data,
    };
}

export function updateTmpData(data) {
    baseLogger(ActionTypes.UPDATE_TMP_DATA);

    return {
        type: ActionTypes.UPDATE_TMP_DATA,
        payload: data,
    };
}
