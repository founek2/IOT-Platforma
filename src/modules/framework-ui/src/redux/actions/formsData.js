import { actionTypes } from '../../constants/redux';
import { validateField as ValidateField, validateForm as ValidateForm, trimFields } from '../../validations';
import {
     getFormDescriptors, getFormData, getRegisteredFields
} from '../../utils/getters';
import { checkValid } from '../../validations';
import { keys, forEach } from 'ramda';
import setInPath from '../../utils/setInPath';
import {baseLogger} from '../../Logger'

export function updateFormField(deepPath, data) {
     return {
          type: actionTypes.UPDATE_FORM_FIELD,
          payload: { deepPath, data }
     };
}

export function fillForm(formName) {
     return function(data) {
          return {
               type: actionTypes.SET_FORM_DATA,
               payload: { formName, data }
          };
     };
}

export function setFormsData(data) {
     return {
          type: actionTypes.SET_FORMS_DATA,
          payload: data
     };
}

export const setFormData = (formName, data) => dispatch => {
	dispatch({
	 type: actionTypes.SET_FORM_DATA,
	 payload: {formName, data}
	})
    }

export function registerField(deepPath) {
	baseLogger(actionTypes.REGISTER_FIELD, deepPath);
     return {
          type: actionTypes.REGISTER_FIELD,
          payload: deepPath
     };
}

export function unregisterField(deepPath) {
	baseLogger(actionTypes.UNREGISTER_FIELD, deepPath);
     return {
          type: actionTypes.UNREGISTER_FIELD,
          payload: deepPath
     };
}

export function updateRegisteredField(deepPath, data) {
     return {
          type: actionTypes.UPDATE_REGISTERED_FIELD,
          payload: { deepPath, data }
     };
}

export function validateField(deepPath) {
     return function(dispatch, getState) {
          baseLogger('VALIDATE_FIELD:', deepPath);
          const fieldState = ValidateField(deepPath, getState());

          dispatch(updateRegisteredField(deepPath, fieldState));
     };
}

export function validateForm(formName, ignoreRequired) {
     return function() {
          return function(dispatch, getState) {
			baseLogger('VALIDATE_FORM:', formName);
			const trimedData = trimFields(getFormData(formName)(getState()));
			dispatch(setFormData(formName, trimedData));
               const fieldStates = ValidateForm(formName, getState(), ignoreRequired);
               dispatch({
                    type: actionTypes.UPDATE_REGISTERED_FIELDS,
                    payload: fieldStates
               });
               return checkValid(fieldStates[formName]);
          };
     };
}

export function resetForm(formName) {
     return function() {
          return function(dispatch, getState) {
               baseLogger('RESET_FORM:', formName);
			const state = getState();	
               const origRegisteredFields = getRegisteredFields(state)[formName];
			const origFormData = getFormData(formName)(state);
               let formData = {};
               let registeredFields = {};
               const resetFormData = fieldPath => {
                    formData = setInPath(fieldPath, '', formData);
			};
			const resetRegisteredFields = fieldPath => {
                    registeredFields = setInPath(fieldPath, { pristine: true, valid: true }, registeredFields);
               };
			forEach(resetFormData, keys(origFormData));
			forEach(resetRegisteredFields, keys(origRegisteredFields));

               dispatch({
                    type: actionTypes.UPDATE_REGISTERED_FIELDS,
                    payload: { [formName]: registeredFields }
               });
               dispatch({
                    type: actionTypes.UPDATE_FORM,
                    payload: { path: formName, data: formData }
               });
          };
     };
}
