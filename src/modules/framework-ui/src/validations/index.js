import { values, forEach, keys, is, clone } from 'ramda';
import { isNotEmpty } from 'ramda-extension';
import getInPath from '../utils/getInPath';
import {
     getFieldDescriptor,
     getFormsData,
     getPristine,
     getFormDescriptors
} from '../utils/getters';
import setInPath from '../utils/setInPath';
import validationFactory from './validationFactory';

const requiredFn = validationFactory('isRequired');

/**
 * Validate field and return fieldState
 * @param {String} deepPath
 * @param {Object} descriptor
 * @param {Object} formData
 */
export const validateField = (deepPath, state, ignorePristine = false, ignoreRequired = false) => {
     const pristine = getPristine(deepPath, state);
     if (!pristine || ignorePristine) {
          const formsData = getFormsData(state);
          const descriptor = getFieldDescriptor(deepPath, state);
          const { required, when, validations } = descriptor;
          const formName = deepPath.split('.')[0];
          const value = getInPath(deepPath, formsData);
          if (!when || (typeof when === 'function' && when(formsData[formName] || {}))) {
               if (required) {
                    if (value && isNotEmpty(value)) {
                         const result = createValidationsResult(value, validations);
                         return createFieldState(result);
                    } else {
                         if (ignoreRequired) {
                              return createFieldState([]);
                         } else {
                              const result = createValidationsResult(value, [requiredFn]);
                              return createFieldState(result);
                         }
                    }
               } else {
				if (value) {
					const result = createValidationsResult(value, validations);
					return createFieldState(result);
				} else {
					return createFieldState([])
				}

               }
          } else {
               return {
                    valid: true,
                    errorMessages: []
               };
          }
     }
};

// upravit validateField, tak aby šel použít pro forEach validateFields
export const validateForm = (formName, state,  ignoreRequiredFields = false) => {
	let results = {};
     const validate = ({ deepPath }) => {
          const result = validateField(deepPath, state, true, ignoreRequiredFields);
          results = setInPath(deepPath, result, results);
     };
     const formDescriptors = getFormDescriptors(formName, state);
	forEach(validate, values(formDescriptors));
     return results;
};

export const isRequired = (descriptor, formData) => {
     const { required, when, deepPath } = descriptor;
     const formName = deepPath.split('.')[0];
     if (typeof when === 'function') {
          return when(formData[formName] || {}) && required;
     } else {
          return required;
     }
};

/**
 * return object {valid: false/true, errors: [{fieldName: ["isRequired"]}]}
 * @param {*} fieldsState
 */
export const checkValid = fieldsState => {
     const output = { valid: true, errors: [] };
     for (const name in fieldsState) {
          const { valid, errorMessages } = fieldsState[name];
          if (valid === false) {
               output.valid = false;
               output.errors.push({ [name]: errorMessages });
          }
     }
     return output;
};
function createValidationsResult(value, validations = []) {
     const result = [];
     validations.forEach(Fn => {
          const output = Fn(value);
          if (output !== true) {
               result.push(output);
          }
     });
     return result;
}

function createFieldState(validationResult) {
     if (isNotEmpty(validationResult)) {
          return {
               valid: false,
               errorMessages: validationResult || []
          };
     } else {
          return {
               valid: true,
               errorMessages: undefined
          };
     }
}

export function trimFields(formData) {
	const newData = clone(formData);
	for(const field in formData) {
		if (is(String, formData[field]))
			newData[field] = formData[field].trim();
	}
	return newData;
}