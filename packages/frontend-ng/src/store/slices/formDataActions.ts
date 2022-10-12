import ErrorMessages from 'common/src/localization/error';
import { logger } from 'common/src/logger';
import { getFieldVal, getFormData, getFormsData } from 'common/src/utils/getters';
import { checkValid, validateField, validateForm, validateRegisteredFields } from 'common/src/validations';
import { AppThunk } from '../../types';
import { formsDataReducerActions } from './formDataSlice';
import { notificationActions } from './notificationSlice';
import fieldDescriptors from 'common/src/fieldDescriptors';
import { FormData } from 'common/src/validations/types';

export const formsDataActions = {
    ...formsDataReducerActions,
    validateField(deepPath: string, ignorePristine = false): AppThunk<{ value: any; valid: boolean }> {
        return function (dispatch, getState) {
            logger.info('VALIDATE_FIELD:', deepPath);
            const fieldState = validateField(
                deepPath,
                { formsData: getFormsData(getState()), fieldDescriptors },
                ignorePristine
            );
            dispatch(formsDataActions.updateRegisteredField({ deepPath, value: fieldState }));
            return { value: getFieldVal(deepPath)(getState()), valid: fieldState.valid };
        };
    },

    // : AppThunk<ReturnType<typeof checkValid>>
    validateForm(formName: string, ignoreRequired = false): AppThunk<{ data?: FormData; valid: boolean }> {
        return function (dispatch, getState) {
            logger.info('VALIDATE_FORM:', formName);

            // dispatch(formsDataActions.setFormData({ formName, data: getFormData(formName)(getState()) }));
            const fieldStates = validateForm(
                formName,
                { formsData: getFormsData(getState()), fieldDescriptors },
                ignoreRequired
            );

            dispatch(formsDataActions.updateRegisteredFields(fieldStates));

            const result = checkValid(fieldStates[formName]);
            if (!result.valid) {
                dispatch(
                    notificationActions.add({
                        message: ErrorMessages.getMessage('validationFailed'),
                        options: { variant: 'error' },
                    })
                );
            }

            return { data: getFormData(formName)(getState()), valid: result.valid };
        };
    },

    validateRegisteredFields(formName: string, ignoreRequired = false): AppThunk<boolean> {
        return function (dispatch, getState) {
            logger.info('VALIDATE_REGISTERED_FIELDS:', formName);

            dispatch(formsDataActions.setFormData({ formName, data: getFormData(formName)(getState()) }));
            const fieldStates = validateRegisteredFields(
                formName,
                { formsData: getFormsData(getState()), fieldDescriptors },
                ignoreRequired
            );

            dispatch(formsDataActions.updateRegisteredFields(fieldStates));

            const result = checkValid(fieldStates[formName]);
            if (!result.valid) {
                dispatch(
                    notificationActions.add({
                        message: ErrorMessages.getMessage('validationFailed'),
                        options: { variant: 'error' },
                    })
                );
            }
            return result.valid;
        };
    },
};
