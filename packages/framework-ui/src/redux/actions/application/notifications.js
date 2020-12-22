import { actionTypes } from '../../../constants/redux';

export function addNotification(index) {
     return {
          type: actionTypes.ADD_NOTIFICATION,
          payload: index
     };
}

export function setNotification(array) {
     return {
          type: actionTypes.SET_NOTIFICITAION,
          payload: array
     };
}


export function closeNotification(id) {
     return {
          type: actionTypes.CLOSE_NOTIFICATION,
          payload: id
     };
}

export function removeNotification(id) {
     return {
          type: actionTypes.REMOVE_NOTIFICATION,
          payload: id
     };
}