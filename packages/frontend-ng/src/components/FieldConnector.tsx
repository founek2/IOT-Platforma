import { SxProps, TextField, Theme } from '@mui/material';
import { logger } from 'common/src/logger';
import { onEnterRun } from 'common/src/utils/onEnter';
import { isRequired } from 'common/src/validations';
import { is } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formsDataActions as formsActions } from '../store/slices/formDataActions';
import chainHandler from 'common/src/utils/chainHandler';
import { getFieldDescriptor, getFieldVal, getFormData, getRegisteredField } from 'common/src/utils/getters';
import { useAppDispatch, useAppSelector } from '../hooks';
import fieldDescriptors from 'common/src/fieldDescriptors';
import getInPath from 'common/src/utils/getInPath';

const { registerField, unregisterField, setFormField, validateField, validateForm, updateRegisteredField } =
    formsActions;

const Components = {
    TextField: TextField,
    // PasswordField: PasswordField,
    // Select: Select,
    // DateTimePicker: DateTimePicker,
    // InputField: InputField,
    // FileLoader: FileLoader,
    // ChipArray: ChipArray,
    // CheckBox: CheckBox,
    // Autocomplete: Autocomplete
};
type componentKeys = keyof typeof Components;

interface ComponentProps {
    id: string;
    onChange: React.EventHandler<any>;
    value: any;
    className?: string;
    error: boolean;
    helperText: string;
    FormHelperTextProps: { error: boolean };
    onFocus: React.EventHandler<any>;
    onBlur: React.EventHandler<any>;
    name?: string;
    autoFocus?: boolean;
    onKeyDown: React.EventHandler<any>;
    label: string;
}

interface FieldConnectorProps {
    deepPath: string;
    onBlur?: React.ChangeEventHandler;
    onFocus?: React.ChangeEventHandler;
    onEnter?: (e: React.KeyboardEvent) => void;
    onChange?: React.ChangeEventHandler<{ value: any }>;
    component?: componentKeys | ((props: ComponentProps) => JSX.Element);
    fieldProps?: any;
    name?: string;
    autoFocus?: boolean;
    sx?: SxProps<Theme>;
    label?: string;
    fullWidth?: boolean;
    variant?: 'filled' | 'outlined' | 'standard';
}

function FieldConnector({
    deepPath,
    onChange,
    onBlur,
    onFocus,
    component = 'TextField',
    fieldProps,
    name,
    autoFocus,
    onEnter,
    sx,
    label,
    fullWidth,
    variant = 'standard',
}: FieldConnectorProps) {
    // registerField: formsDataActions.registerField,
    // unregisterField: formsDataActions.unregisterField,
    // updateRegisteredField: formsDataActions.updateRegisteredField,
    // setFormField: formsDataActions.setFormField,
    // validateField: formsDataActions.validateField,
    const dispatch = useAppDispatch();
    const [dirty, setDirty] = useState(false);
    const formData = useAppSelector(getFormData(deepPath.split('.')[0]));
    const registeredField = useAppSelector(getRegisteredField(deepPath));
    const descriptor = getInPath(deepPath, fieldDescriptors);
    const value = useAppSelector((state) => getFieldVal(deepPath)(state));

    useEffect(() => {
        dispatch(registerField(deepPath));
        if (value) dispatch(validateField(deepPath, true));

        return () => {
            dispatch(unregisterField(deepPath));
        };
    }, [dispatch]);

    if (!descriptor) {
        logger.error('FieldConnector> missing descriptor for -', deepPath);
        return null;
    }
    //const { descriptor, registeredField, fieldValue: value } = data

    function _handleChange({ target: { value } }: any, pristine: boolean) {
        dispatch(setFormField({ deepPath, value }));
        if (!pristine) dispatch(validateField(deepPath));
    }
    function _changePristine() {
        dispatch(updateRegisteredField({ deepPath, value: { pristine: false } }));
    }

    const { valid, errorMessages, pristine } = registeredField || { valid: true };

    const onChangeHandler = (e: any) => {
        _handleChange(e, Boolean(pristine));
        onChange && onChange(e);
    };

    if (descriptor) {
        const required = isRequired(descriptor, formData, deepPath); // check when condition
        const finalLabel = label ? label : descriptor.label;

        const Component = is(String, component) ? Components[component] : component;

        return (
            <Component
                id={deepPath}
                onChange={onChangeHandler}
                value={value || value === false ? value : ''}
                sx={sx}
                error={!valid}
                // required={required}
                helperText={errorMessages && errorMessages[0]}
                FormHelperTextProps={{ error: !valid }}
                onFocus={onFocus}
                onBlur={chainHandler([
                    () => pristine && (value || dirty) && _changePristine(),
                    () => dispatch(validateField(deepPath)),
                    onBlur,
                ])}
                name={name || descriptor.name}
                autoFocus={autoFocus}
                onKeyDown={chainHandler([() => !dirty && setDirty(true), onEnter && onEnterRun(onEnter)])}
                label={required ? finalLabel + ' *' : finalLabel}
                fullWidth={fullWidth}
                variant={variant}
                {...fieldProps}
            />
        );
    } else {
        logger.error('Missing descriptor: ' + deepPath);
        return null;
    }
}

export default FieldConnector;
