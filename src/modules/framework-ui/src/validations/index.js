import { values, forEach, keys, is, clone, forEachObjIndexed, uniq, F, isNil } from 'ramda';
import { isNotEmpty } from 'ramda-extension';
import getInPath from '../utils/getInPath';
import {
     getFieldDescriptor,
     getFormsData,
     getPristine,
     getFormDescriptors,
     getRegisteredField,
     getFormData,
     getRegisteredFields
} from '../utils/getters';
import setInPath from '../utils/setInPath';
import validationFactory from './validationFactory';

const requiredFn = validationFactory('isRequired');
const notEmptyVal = (val) => requiredFn == true

export const validateField = (deepPath, state, ignorePristine = false, ignoreRequired = false) => {
     const pristine = getPristine(deepPath, state);
     if (!pristine || ignorePristine) {
          const formsData = getFormsData(state);

          const descriptor = getFieldDescriptor(deepPath, state);

          if (!descriptor) return {
               valid: false,
               errorMessages: ["missingDescriptor"]
          }
          const { required, when, validations } = descriptor;
          const formName = deepPath.split('.')[0];


          const value = getInPath(deepPath, formsData);
          // console.log(deepPath, value)
          if (!when || (typeof when === 'function' && when(formsData[formName] || {}))) {
               if (required) {
                    if (notEmptyVal(value)) {
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

function recursive(transform, predicate, arrayPredicate, object) {
     const func = (accum = '') => (value, key) => {
          if (arrayPredicate(value, accum + key)) return recArray(value, accum + key + ".") // pouze pokud existuje descriptor pro array
          if (predicate(value)) return recObj(value, accum + key + ".")
          transform(value, accum + key)
     }

     function recObj(obj, accum) {
          forEachObjIndexed(func(accum), obj)
     }

     function recArray(obj, accum) {
          obj.map(func(accum))
     }
     recObj(object)
}

const isObject = (val) => Object.prototype.toString.call(val) === "[object Object]"

export const validateForm = (formName, state, ignoreRequiredFields = false) => {
     const formDescriptors = getFormDescriptors(formName, state);
     const formData = getFormData(formName)(state)

     const arraOfPaths = []
     const arrayOfArrayFields = [] // to know when validate array as array and when as array of fields
     let result = {}

     // find all deePaths of - fields and array of fields
     const arrayRegex = /\[\]$/;
     recursive((val, deepPath) => {
          // if (deepPath === formName) debugger
          if (arrayRegex.test(deepPath)) arrayOfArrayFields.push(deepPath.replace(arrayRegex, ""))
          else arraOfPaths.push(deepPath)
     }, (val) => {
          return isObject(val) && !val.deepPath
     }, F, { [formName]: formDescriptors })

     // find all array of fields in formData
     recursive((val, deepPath) => {
          // if (deepPath === formName) debugger
          arraOfPaths.push(deepPath)
     }, isObject,
          (val, deepPath) =>
               is(Array, val) && arrayOfArrayFields.some(p => p === deepPath)
          , { [formName]: formData })

     // just for FrontEnd validations - field can be mounted and do not have value in formData
     // It still needs be validated
     const regFields = getRegisteredFields(state)
     if (regFields && regFields[formName]) {
          const fields = regFields[formName];
          recursive((val, deepPath) => {
               // if (deepPath === formName) debugger
               arraOfPaths.push(deepPath)
          }, val => isObject(val) && val.valid == undefined,
               (val, deepPath) =>
                    is(Array, val) && arrayOfArrayFields.some(p => p === deepPath)
               , { [formName]: fields })
     }


     const uniqArray = uniq(arraOfPaths)
     console.log(uniqArray)
     forEach((deepPath) => {
          const out = validateField(deepPath, state, true, ignoreRequiredFields);
          result = setInPath(deepPath, out, result);
     }, uniqArray)
     return result;
};

export const validateRegisteredFields = (formName, state, ignoreRequiredFields = false) => {
     const formDescriptors = getFormDescriptors(formName, state);

     const arraOfPaths = []
     const arrayOfArrayFields = [] // to know when validate array as array and when as array of fields
     let result = {}

     // find all deePaths of - fields and array of fields
     const arrayRegex = /\[\]$/;
     recursive((val, deepPath) => {
          // if (deepPath === formName) debugger
          if (arrayRegex.test(deepPath)) arrayOfArrayFields.push(deepPath.replace(arrayRegex, ""))
          else arraOfPaths.push(deepPath)
     }, (val) => {
          return isObject(val) && !val.deepPath
     }, F, { [formName]: formDescriptors })

     // just for FrontEnd validations - field can be mounted and do not have value in formData
     // It still needs to be validated
     const regFields = getRegisteredFields(state)
     if (regFields && regFields[formName]) {
          recursive((val, deepPath) => {
               // if (deepPath === formName) debugger
               arraOfPaths.push(deepPath)
          }, val => isObject(val) && val.valid == undefined,
               (val, deepPath) =>
                    is(Array, val) && arrayOfArrayFields.some(p => p === deepPath)
               , { [formName]: regFields[formName] })
     }


     const uniqArray = uniq(arraOfPaths)
     forEach((deepPath) => {
          const out = validateField(deepPath, state, true, ignoreRequiredFields);
          result = setInPath(deepPath, out, result);
     }, uniqArray)
     return result;
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

     const transform = accum => (value, key) => {
          if (value.valid === undefined) return transformRec(value, accum + key + ".")
          if (Array.isArray(value)) {
               let i = 0;
               value.forEach(({ valid, errorMessages }) => {
                    if (valid === false) {
                         output.valid = false;
                         output.errors.push({ [`${accum + key}.${i++}`]: errorMessages });
                    }
               })
          } else {
               const { valid, errorMessages } = value;
               if (valid === false) {
                    output.valid = false;
                    output.errors.push({ [accum + key]: errorMessages });
               }
          }
     }
     function transformRec(fields, accum) {
          forEachObjIndexed(transform(accum), fields)
     }
     transformRec(fieldsState, '')
     return output;
};
export function createValidationsResult(value, validations = []) {
     const result = [];
     validations.forEach(Fn => {
          const output = Fn(value);
          if (output !== true) {
               result.push(output);
          }
     });
     return result;
}

export function createFieldState(validationResult) {
     if (isNotEmpty(validationResult)) {
          return {
               valid: false,
               errorMessages: validationResult || []
          };
     } else {
          return {
               valid: true,
               errorMessages: []
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