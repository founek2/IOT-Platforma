import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import {
     getFormsData,
     getFieldDescriptor,
     getFieldVal,
     getFieldDescriptors,
     getRegisteredField
} from '../utils/getters'
import { formsDataActions } from '../redux/actions'
import { isRequired } from '../validations'
import { bindActionCreators } from 'redux'
import { is } from 'ramda'
import chainHandler from '../utils/chainHandler'
import { isNotNil } from 'ramda-extension'
import { errorLog } from '../Logger'
import Select from '../Components/Select'
import ChipArray from './ChipArray'
import FileLoader from './fieldConnector/FileLoader'
import PasswordField from './fieldConnector/PasswordField'
import TextField from './fieldConnector/TextField'
import Checkbox from './fieldConnector/Checkbox'
import TimePicker from './fieldConnector/TimePicker'

const Components = {
     TextField,
     Select,
     ChipArray,
     FileLoader,
     PasswordField,
     Checkbox,
     TimePicker
}
const onEnterRun = Fn => e => {
     if (e.keyCode === 13) Fn(e)
}
function fieldConnector({
     deepPath,
     onChange,
     formsData,
     registeredField = {},
     descriptor,
     onBlur,
     onFocus,
     component = 'TextField',
     fieldProps,
     name,
     autoFocus,
     selectOptions,
     optionsData,
     onEnter,
     value,
     className,
     label,
     registerField,
     unregisterField,
     validateField,
     updateRegisteredField,
     updateFormField,
}) {

     useEffect(() => {
          registerField(deepPath)
          if (value) validateField(deepPath, true)

          return () => unregisterField(deepPath)
     }, [])

     function _handleChange({ target: { value } }, pristine) {
          updateFormField(deepPath, value)
          !pristine && validateField(deepPath)
     }
     function _changePristine() {
          updateRegisteredField(deepPath, { pristine: false })
     }
     function _validateField() {
          validateField(deepPath)
     }

     const { valid, errorMessages, pristine } = registeredField

     const onChangeHandler = e => {
          _handleChange(e, pristine)
          onChange && onChange(e)
     }
     if (isNotNil(descriptor)) {
          const required = isRequired(descriptor, formsData, deepPath)     // check when condition 
          const finalLabel = label ? label : descriptor.label;

          const Component = is(String, component) ? Components[component] : component;
          let options = {}
          if (component === 'Select') {
               options = { selectOptions }
          }
          if (component === 'ChipArray') options = { optionsData }
          return (
               <Component
                    onChange={onChangeHandler}
                    value={value}
                    className={className}
                    error={!valid}
                    // required={required}
                    helperText={errorMessages && errorMessages[0]}
                    FormHelperTextProps={{ error: !valid }}
                    onFocus={onFocus}
                    onBlur={chainHandler([
                         () => pristine && value && _changePristine(),
                         _validateField,
                         onBlur
                    ])}
                    name={name || descriptor.name}
                    autoFocus={autoFocus}
                    onKeyDown={onEnter && onEnterRun(onEnter)}
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

const _mapStateToProps = (state, { deepPath }) => ({
     formsData: getFormsData(state),
     registeredField: getRegisteredField(deepPath, state),
     fieldDescriptors: getFieldDescriptors(state),
     descriptor: getFieldDescriptor(deepPath, state),
     value: getFieldVal(deepPath, state),
     state,
})

const _mapDispatchToProps = dispatch =>
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
)(fieldConnector)
