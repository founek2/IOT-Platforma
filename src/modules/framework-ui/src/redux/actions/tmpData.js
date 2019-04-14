import { actionTypes } from '../../constants/redux';
import {baseLogger} from 'framework-ui/src/Logger'

export function setTmpData(data) {
	baseLogger(actionTypes.SET_TMP_DATA)

     return {
          type: actionTypes.SET_TMP_DATA,
          payload: data
     };
}

export function updateTmpData(data) {
	baseLogger(actionTypes.UPDATE_TMP_DATA)

     return {
          type: actionTypes.UPDATE_TMP_DATA,
          payload: data
     };
}