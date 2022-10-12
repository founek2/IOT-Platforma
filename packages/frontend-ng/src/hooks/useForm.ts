import { getFormData } from 'common/src/utils/getters';
import { FieldState } from 'common/src/validations/types';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { formsDataActions } from '../store/slices/formDataActions';
import { Leaves, Paths } from '../types';

export function useForm<T = FormData>(formName: string) {
    const dispatch = useAppDispatch();
    const validateForm = React.useCallback(
        () => dispatch(formsDataActions.validateForm(formName)) as { data: T; valid: boolean },
        [dispatch]
    );
    const validateField = React.useCallback(
        (fieldPath: Paths<T>) => dispatch(formsDataActions.validateField(`${formName}.${fieldPath}`, true)),
        [dispatch]
    );
    const setFieldValue = React.useCallback(
        (value: any, fieldPath: Paths<T>) =>
            dispatch(formsDataActions.setFormField({ deepPath: `${formName}.${fieldPath.join('.')}`, value })),
        [dispatch]
    );
    const resetForm = React.useCallback(() => dispatch(formsDataActions.removeForm(formName)), [dispatch]);
    const data = (useAppSelector(getFormData(formName)) || {}) as unknown as T;

    return {
        validateField,
        validateForm,
        setFieldValue,
        resetForm,
        data,
    };
}
