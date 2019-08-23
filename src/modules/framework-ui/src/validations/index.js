import { values, forEach, keys, is, clone, forEachObjIndexed } from 'ramda';
import { isNotEmpty } from 'ramda-extension';
import getInPath from '../utils/getInPath';
import {
     getFieldDescriptor,
     getFormsData,
     getPristine,
     getFormDescriptors,
     getRegisteredField,
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
                              console.log(deepPath)
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
export const validateForm = (formName, state, ignoreRequiredFields = false) => {
     let results = {};
     const formDescriptors = getFormDescriptors(formName, state);

     const validate = (obj) => {
          const { deepPath } = obj
          if (!deepPath) return validateRec(obj)
          //console.log(deepPath, deepPath.match(/\[\]$/))

          if (deepPath.match(/\[\]$/)) {    // for array of values
               const genericDeepPath = deepPath.replace(/\[\]$/, '');
               const registeredFields = getRegisteredField(genericDeepPath, state);

               const validateF = (val, i) => {
                    const pathOfField = `${genericDeepPath}.${i}`;
                    const result = validateField(pathOfField, state, true, ignoreRequiredFields);
                    results = setInPath(pathOfField, result, results);
               }
               if (registeredFields)
                    [...Array(registeredFields.length)].map(validateF)
          } else {
               const result = validateField(deepPath, state, true, ignoreRequiredFields);
               results = setInPath(deepPath, result, results);
          }
     };

     /**
      * Recursively find all descriptor fields and their deepPaths -> than validate them by deepPath
      * @param {object} descriptors 
      */
     function validateRec(descriptors) {
          forEach(validate, values(descriptors));
     }
     validateRec(formDescriptors)
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
     // for (const name in fieldsState) {
     //      if (Array.isArray(fieldsState[name])) {
     //           let i = 0;
     //           fieldsState[name].forEach(({valid, errorMessages}) => {
     //                if (valid === false) {
     //                     output.valid = false;
     //                     output.errors.push({ [`${name}.${i++}`]: errorMessages });
     //                }
     //           })
     //      }else {
     //           const { valid, errorMessages } = fieldsState[name];
     //           if (valid === false) {
     //                output.valid = false;
     //                output.errors.push({ [name]: errorMessages });
     //           }
     //      }
     // }
     const transform = accum => (value, key) => {
          if (value.valid === undefined) return transformRec(value, accum + "." + key)

          if (Array.isArray(value)) {
               let i = 0;
               value.forEach(({ valid, errorMessages }) => {
                    if (valid === false) {
                         output.valid = false;
                         output.errors.push({ [`${accum + "." + key}.${i++}`]: errorMessages });
                    }
               })
          } else {
               const { valid, errorMessages } = value;
               if (valid === false) {
                    output.valid = false;
                    output.errors.push({ [accum + "." + key]: errorMessages });
               }
          }
     }
     function transformRec(fields, accum) {
          forEachObjIndexed(transform(accum), fields)
     }
     transformRec(fieldsState, '')
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
     for (const field in formData) {
          if (is(String, formData[field]))
               newData[field] = formData[field].trim();
     }
     return newData;
}