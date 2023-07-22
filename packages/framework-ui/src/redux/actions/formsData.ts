import { ActionTypes } from '../../constants/redux';
import {
    validateField as ValidateField,
    validateForm as ValidateForm,
    validateRegisteredFields as ValidateRegisteredFields,
} from '../../validations';
import { getFormData, getRegisteredFields } from '../../utils/getters';
import { checkValid } from '../../validations';
import setInPath from '../../utils/setInPath';
import { curry, forEachObjIndexed, is } from 'ramda';
import { notificationsActions } from './application/notifications';
import ErrorMessages from '../../localization/errorMessages';
import { formsDataReducerActions } from '../reducers/formsData';
import { AppThunk } from '../../types';

function recursive(transform: any, predicate: any, object: any) {
    const func =
        (accum = '') =>
            (value: any, key: any) => {
                if (predicate(value)) return rec(value, accum + key + '.');
                transform(value, accum + key);
            };

    function rec(obj: any, accum?: any) {
        forEachObjIndexed(func(accum), obj);
    }
    rec(object);
}

export const formsDataActions = {
    ...formsDataReducerActions,

    validateField(deepPath: string, ignorePristine = false): AppThunk<ReturnType<typeof ValidateField>> {
        return function (dispatch, getState) {
            console.info('VALIDATE_FIELD:', deepPath);
            const fieldState = ValidateField(deepPath, getState(), ignorePristine);
            dispatch(formsDataActions.updateRegisteredField({ deepPath, value: fieldState }));
            return fieldState;
        };
    },

    validateForm(formName: string, ignoreRequired = false): AppThunk<ReturnType<typeof checkValid>> {
        return function (dispatch, getState) {
            console.info('VALIDATE_FORM:', formName);

            dispatch(formsDataActions.setFormData({ formName, data: getFormData(formName)(getState()) }));
            const fieldStates = ValidateForm(formName, getState(), ignoreRequired);

            dispatch(formsDataActions.updateRegisteredFields(fieldStates));

            // @ts-ignore
            const result = checkValid(fieldStates[formName]);
            if (!result.valid) {
                console.error(fieldStates);
                dispatch(
                    notificationsActions.add({
                        message: ErrorMessages.getMessage('validationFailed'),
                        variant: 'error',
                        duration: 3000,
                    })
                );
            }
            return result;
        };
    },

    validateRegisteredFields(formName: string, ignoreRequired = false): AppThunk<ReturnType<typeof checkValid>> {
        return function (dispatch, getState) {
            console.info('VALIDATE_REGISTERED_FIELDS:', formName);

            dispatch(formsDataActions.setFormData({ formName, data: getFormData(formName)(getState()) }));
            const fieldStates = ValidateRegisteredFields(formName, getState(), ignoreRequired);

            dispatch(formsDataActions.updateRegisteredFields(fieldStates));

            const result = checkValid(fieldStates[formName]);
            if (!result.valid) {
                dispatch(
                    notificationsActions.add({
                        message: ErrorMessages.getMessage('validationFailed'),
                        variant: 'error',
                        duration: 3000,
                    })
                );
            }
            return result;
        };
    },

    // TODO maybe broken?? Do I even need it???
    resetForm(formName: string): AppThunk {
        return function (dispatch, getState) {
            console.info('RESET_FORM:', formName);
            const state = getState();

            // @ts-ignore
            const origRegisteredFields = getRegisteredFields(state)[formName];
            const origFormData = getFormData(formName)(state);
            let formData = {};
            let registeredFields = {};
            const resetFormData = (value: any, fieldPath: string) => {
                if (is(Array, value)) formData = setInPath(fieldPath, [], formData);
                else formData = setInPath(fieldPath, '', formData);
            };
            const resetRegisteredFields = (val: any, fieldPath: string) => {
                registeredFields = setInPath(fieldPath, { pristine: true, valid: true }, registeredFields);
            };

            recursive(
                resetFormData,
                (val: any) => {
                    return is(Array, val) && !is(String, val);
                },
                origFormData
            );

            recursive(
                resetRegisteredFields,
                ({ valid }: { valid: boolean }) => {
                    return valid === undefined;
                },
                origRegisteredFields
            );

            dispatch(formsDataActions.updateRegisteredFields({ [formName]: registeredFields }));
            dispatch(formsDataActions.updateFormData({ formName, data: formData }));
        };
    },
};
