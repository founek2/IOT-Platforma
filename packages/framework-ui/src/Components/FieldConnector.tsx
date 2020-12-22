import chainHandler from '../utils/chainHandler'
import { isRequired } from '../validations'
import { is } from 'ramda'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// @ts-ignore
import { formsDataActions } from '../redux/actions'
import TextField from './fieldConnector/TextField'
import DateTimePicker from './fieldConnector/DateTimePicker'
import PasswordField from './fieldConnector/PasswordField'
import InputField from './fieldConnector/InputField'
import FileLoader from './fieldConnector/FileLoader'
import Select from './fieldConnector/Select'
import {
    getFormsData,
    getFieldDescriptor,
    getFieldVal,
    getFieldDescriptors,
    getRegisteredField
} from '../utils/getters'

const errorLog = console.error

const Components = {
    "TextField": TextField,
    "PasswordField": PasswordField,
    "Select": Select,
    "DateTimePicker": DateTimePicker,
    "InputField": InputField,
    "FileLoader": FileLoader,
}
type componentKeys = keyof typeof Components

const onEnterRun = (Fn: (e: React.KeyboardEvent) => void) => (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) Fn(e)
}

interface FieldConnectorProps {
    deepPath: string;
    registeredField?: any;
    descriptor?: any;
    value?: any
    onBlur?: React.ChangeEventHandler;
    onFocus?: React.ChangeEventHandler;
    onEnter?: (e: React.KeyboardEvent) => void,
    onChange?: React.ChangeEventHandler;
    component?: componentKeys | ((props: any) => JSX.Element);
    fieldProps?: any
    name?: string
    autoFocus?: boolean
    selectOptions?: any
    optionsData?: any
    className?: string
    label?: string
    registerField: any,
    unregisterField: any,
    updateRegisteredField: any
    updateFormField: any
    validateField: any
    formsData: any
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
    registerField,
    unregisterField,
    validateField,
    updateRegisteredField,
    updateFormField,
    value,
    registeredField,
    descriptor,
    formsData
}: FieldConnectorProps) {
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        registerField(deepPath)
        if (value) validateField(deepPath, true)

        return () => unregisterField(deepPath)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!descriptor) {
        console.error("FieldConnector> missing descriptor for -", deepPath)
        return null;
    }
    //const { descriptor, registeredField, fieldValue: value } = data

    function _handleChange({ target: { value } }: any, pristine: boolean) {
        updateFormField(deepPath, value)
        !pristine && validateField(deepPath)
    }
    function _changePristine() {
        updateRegisteredField(deepPath, { pristine: false })
    }

    const { valid, errorMessages, pristine } = registeredField || { valid: true }

    const onChangeHandler = (e: any) => {
        _handleChange(e, Boolean(pristine))
        onChange && onChange(e)
    }

    if (descriptor) {
        const required = isRequired(descriptor, formsData, deepPath)     // check when condition 
        const finalLabel = label ? label : descriptor.label;

        // @ts-expect-error
        const Component = is(String, component) ? Components[component] : component;
        let options = {}
        if (component === 'Select') {
            options = { selectOptions }
        }
        // if (component === 'ChipArray') options = { optionsData }
        return (
            <Component
                id={deepPath}
                onChange={onChangeHandler}
                value={value || value === false ? value : ""}
                className={className}
                error={!valid}
                // required={required}
                helperText={errorMessages && errorMessages[0]}
                FormHelperTextProps={{ error: !valid }}
                onFocus={onFocus}
                onBlur={chainHandler([
                    () => pristine && (value || dirty) && _changePristine(),
                    () => validateField(deepPath),
                    onBlur
                ])}
                name={name || descriptor.name}
                autoFocus={autoFocus}
                onKeyDown={chainHandler([
                    () => !dirty && setDirty(true),
                    onEnter && onEnterRun(onEnter),
                ])}
                label={required ? finalLabel + ' *' : finalLabel}
                {...options}
                {...fieldProps}
            />
        )
    } else {
        errorLog('Missing descriptor: ' + deepPath)
        return null
    }
}

const _mapStateToProps = (state: any, { deepPath }: FieldConnectorProps) => ({
    formsData: getFormsData(state),
    registeredField: getRegisteredField(deepPath, state),
    fieldDescriptors: getFieldDescriptors(state),
    descriptor: getFieldDescriptor(deepPath, state),
    value: getFieldVal(deepPath, state),
    state,
})

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            registerField: formsDataActions.registerField,
            unregisterField: formsDataActions.unregisterField,
            updateRegisteredField: formsDataActions.updateRegisteredField,
            updateFormField: formsDataActions.updateFormField,
            validateField: formsDataActions.validateField
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(FieldConnector)