import { merge, dissocPath, dissoc } from 'ramda';
import setInPath from '../../utils/setInPath';
import getInPath from '../../utils/getInPath';
import { actionTypes } from '../../constants/redux';

export const setFieldDescriptors = {
     next(state, action) {
          return action.payload
     }
};

export const updateField = {
	next(state, action) {
		const { deepPath, data } = action.payload;
		const updatedFormData = setInPath(deepPath, data, state);
          return updatedFormData;
     }
};

export const registerField = {
	next(state, action) {
		const newRegisteredField = setInPath('registeredFields.' + action.payload, {valid: true, pristine: true}, state);
          return newRegisteredField;
     }
};

export const unregisterField = {
	next(state, action) {
		const updatedState = dissocPath(['registeredFields', ...action.payload.split('.')], state);
          return updatedState;
     }
};

export const updateRegisteredField = {
	next(state, {payload}) {
		const {deepPath, data} = payload;
		const fieldState = getInPath('registeredFields.' + deepPath, state);
		const newFieldState = merge(fieldState, data);
		const updatedState = setInPath('registeredFields.' + deepPath, newFieldState, state)
          return updatedState;
     }
}

export const updateRegisteredFields = {
	next(state, {payload}) {
		const fieldState = getInPath('registeredFields', state);
		console.log("merging", fieldState, payload)
		const newFieldState = merge(fieldState, payload);
		const updatedState = setInPath('registeredFields', newFieldState, state)
          return updatedState;
     }
}

const setFormsData = {
     next(state, action) {
          const { path, data } = action.payload;
		const updateForm = {[path]: data};
          return updateForm
     }
};

const updateForm = {
	next(state, action) {
		const { path, data } = action.payload;
		const updateForm = merge(state, {[path]: data});
          return updateForm
     }
};

const setFormData = {
	next(state, action) {
		const { formName, data } = action.payload;
          return setInPath(formName, data, state)
     }
}

const removeForm = {
	next(state, action) {
        return dissoc(action.payload, state)
     }
}

export const formDataReducers = {
	[actionTypes.SET_FORMS_DATA]: setFormsData,
	[actionTypes.UPDATE_FORM_FIELD]: updateField,
	[actionTypes.REGISTER_FIELD]: registerField,
	[actionTypes.UNREGISTER_FIELD]: unregisterField,
	[actionTypes.UPDATE_REGISTERED_FIELD]: updateRegisteredField,
	[actionTypes.UPDATE_FORM]: updateForm,
	[actionTypes.UPDATE_REGISTERED_FIELDS]: updateRegisteredFields,
	[actionTypes.SET_FORM_DATA]: setFormData,
	[actionTypes.REMOVE_FORM]: removeForm,
};