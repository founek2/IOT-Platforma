import React from 'react';
import { useAppDispatch } from '.';
import { formsDataActions } from '../store/slices/formDataActions';
import { Paths } from '../types';

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
    const setFormData = React.useCallback(
        (formData: T) => dispatch(formsDataActions.setFormData({ formName: formName, data: formData } as any)),
        [dispatch]
    );
    const resetForm = React.useCallback(() => {
        dispatch(formsDataActions.removeForm(formName));
    }, [dispatch]);

    return {
        validateField,
        validateForm,
        setFieldValue,
        resetForm,
        setFormData,
    };
}
