import { ActionTypes } from '../../../constants/redux';

export function addNotification(object) {
    return {
        type: ActionTypes.ADD_NOTIFICATION,
        payload: object,
    };
}

export function removeNotification(id) {
    return {
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: id,
    };
}
