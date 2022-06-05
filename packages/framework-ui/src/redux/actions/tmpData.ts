import { ActionTypes } from '../../constants/redux';
import { logger } from '../../logger';

export function setTmpData(data) {
    logger.info(ActionTypes.SET_TMP_DATA);

    return {
        type: ActionTypes.SET_TMP_DATA,
        payload: data,
    };
}

export function updateTmpData(data) {
    logger.info(ActionTypes.UPDATE_TMP_DATA);

    return {
        type: ActionTypes.UPDATE_TMP_DATA,
        payload: data,
    };
}
