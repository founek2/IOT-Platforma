import { actionTypes } from '../../../constants/redux';

export function addNotification(object) {
    return {
        type: actionTypes.ADD_NOTIFICATION,
        payload: object
    };
}

export function removeNotification(id) {
    return {
        type: actionTypes.REMOVE_NOTIFICATION,
        payload: id
    };
}