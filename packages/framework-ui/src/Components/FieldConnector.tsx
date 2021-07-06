import chainHandler from '../utils/chainHandler';
import { isRequired } from '../validations';
import { is } from 'ramda';
import React, { useEffect, useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore
import { formsDataActions as formsActions } from '../redux/actions/formsData';
import TextField from './fieldConnector/TextField';
import DateTimePicker from './fieldConnector/DateTimePicker';
import PasswordField from './fieldConnector/PasswordField';
import InputField from './fieldConnector/InputField';
import FileLoader from './fieldConnector/FileLoader';
import Select from './Select';
import CheckBox from './fieldConnector/CheckBox';
import {
    getFormsData,
    getFieldDescriptor,
    getFieldVal,
    getFieldDescriptors,
    getRegisteredField,
    getFormData,
} from '../utils/getters';
import ChipArray from './ChipArray';
import { onEnterRun } from '../utils/onEnter';
import { logger } from '../logger';
import { State, FieldState, FieldDescriptor, FormData } from '../types';

const {
    registerField,
    unregisterField,
    setFormField,
    validateField,
    validateForm,
    updateRegisteredField
} = formsActions

const Components = {
    TextField: TextField,
    PasswordField: PasswordField,
    Select: Select,
    DateTimePicker: DateTimePicker,
    InputField: InputField,
    FileLoader: FileLoader,
    ChipArray: ChipArray,
    CheckBox: CheckBox,
};
type componentKeys = keyof typeof Components;

interface ComponentProps {
    id: string,
    onChange: React.EventHandler<any>,
    value: any,
    className?: string,
    error: boolean,
    helperText: string,
    FormHelperTextProps: { error: boolean },
    onFocus: React.EventHandler<any>,
    onBlur: React.EventHandler<any>,
    name?: string,
    autoFocus?: boolean
    onKeyDown: React.EventHandler<any>,
    label: string,
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
    selectOptions?: any;
    optionsData?: any;
    className?: string;
    label?: string;
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
    selectOptions,
    optionsData,
    onEnter,
    className,
    label,
}: FieldConnectorProps) {
    // registerField: formsDataActions.registerField,
    // unregisterField: formsDataActions.unregisterField,
    // updateRegisteredField: formsDataActions.updateRegisteredField,
    // setFormField: formsDataActions.setFormField,
    // validateField: formsDataActions.validateField,
    const dispatch = useDispatch()
    const [dirty, setDirty] = useState(false);
    const formData = useSelector<State>(getFormData(deepPath.split('.')[0])) as FormData
    const registeredField = useSelector(getRegisteredField(deepPath)) as FieldState
    const descriptor = useSelector(getFieldDescriptor(deepPath)) as FieldDescriptor | undefined
    const value = useSelector(getFieldVal(deepPath)) as any

    useEffect(() => {
        dispatch(registerField(deepPath));
        if (value) dispatch(validateField(deepPath, true));

        return () => {
            dispatch(unregisterField(deepPath))
        };
    }, [dispatch]);

    if (!descriptor) {
        logger.error('FieldConnector> missing descriptor for -', deepPath);
        return null;
    }
    //const { descriptor, registeredField, fieldValue: value } = data

    function _handleChange({ target: { value } }: any, pristine: boolean) {
        dispatch(setFormField({ deepPath, value }));
        console.log("_handleChange", pristine)
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

        // @ts-expect-error
        const Component = is(String, component) ? Components[component] : component;
        let options = {};
        if (component === 'Select') {
            options = { selectOptions };
        }
        if (component === 'ChipArray') options = { optionsData };
        return (
            <Component
                id={deepPath}
                onChange={onChangeHandler}
                value={value || value === false ? value : ''}
                className={className}
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
                {...options}
                {...fieldProps}
            />
        );
    } else {
        logger.error('Missing descriptor: ' + deepPath);
        return null;
    }
}


export default FieldConnector;
