import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
     getFormsData,
     getFieldDescriptor,
     getFieldVal,
     getFieldDescriptors,
     getRegisteredField
} from 'framework-ui/src/utils/getters'
import { formsDataActions } from '../redux/actions'
import { isRequired } from 'framework-ui/src/validations'
import { bindActionCreators } from 'redux'
import { is } from 'ramda'
import chainHandler from 'framework-ui/src/utils/chainHandler'
import { isNotNil } from 'ramda-extension'
import { errorLog } from '../Logger'
import TextField from '@material-ui/core/TextField'
import Select from 'framework-ui/src/Components/Select'
import ChipArray from './ChipArray'
import FileLoader from './fieldConnector/FileLoader'

const Components = {
     TextField: TextField,
     Select: Select,
	ChipArray: ChipArray,
	FileLoader: FileLoader
}
const onEnterRun = Fn => e => {
     if (e.keyCode === 13) Fn(e)
}
class fieldConnector extends Component {
     constructor(props) {
          super(props)
          const { updateFormField, registerField, deepPath, descriptor } = this.props
		registerField(deepPath)
		if (descriptor && descriptor.defaultValue)
			updateFormField(deepPath, descriptor.defaultValue);
     }
     componentWillUnmount() {
          const { unregisterField, deepPath } = this.props
          unregisterField(deepPath)
     }
     _handleChange = (e, pristine) => {
          const { updateFormField, validateField, deepPath } = this.props
          const { value } = e.target
          updateFormField(deepPath, value)
          !pristine && validateField(deepPath)
     }
     _changePristine = () => {
          const { updateRegisteredField, deepPath } = this.props
          updateRegisteredField(deepPath, { pristine: false })
     }
     _validateField = () => {
          const { deepPath, validateField } = this.props
          validateField(deepPath)
     }
     render() {
          const {
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
               className
          } = this.props
          const { valid, errorMessages, pristine } = registeredField

          const onChangeHandler = e => {
               this._handleChange(e, pristine)
               onChange && onChange(e)
          }
          if (isNotNil(descriptor)) {
               const required = isRequired(descriptor, formsData)
               const { label } = descriptor
               if (is(Object, component)) {
                    const compWithProps = React.cloneElement(component, {
                         value: value || '',
                         onChange: onChangeHandler,
                         helperText: errorMessages && errorMessages[0],
                         FormHelperTextProps: { error: !valid },
                         error: !valid,
                         label: label
                    })
                    return compWithProps
               } else {
                    const Component = Components[component]
                    let options = {}
                    let dontHaveRequired
                    if (component === 'Select') {
                         options = { selectOptions }
                         dontHaveRequired = true
                    }
                    if (component === 'ChipArray') options = { optionsData }
                    return (
                         <Component
                              onChange={onChangeHandler}
                              value={value || ''}
                              className={className}
                              error={!valid}
                              required={required}
                              helperText={errorMessages && errorMessages[0]}
                              FormHelperTextProps={{ error: !valid }}
                              onFocus={onFocus}
                              onBlur={chainHandler([
                                   () => pristine && value && this._changePristine(),
                                   this._validateField,
                                   onBlur
                              ])}
                              name={name}
                              autoFocus={autoFocus}
                              onKeyDown={onEnter && onEnterRun(onEnter)}
                              label={required && dontHaveRequired ? label + ' *' : label}
                              {...options}
                              {...fieldProps}
                         />
                    )
               }
          } else {
               errorLog('Missing descriptor: ' + deepPath)
               return null
          }
     }
}
const _mapStateToProps = (state, { deepPath }) => ({
     formsData: getFormsData(state),
     registeredField: getRegisteredField(deepPath, state),
     fieldDescriptors: getFieldDescriptors(state),
     descriptor: getFieldDescriptor(deepPath, state),
     value: getFieldVal(deepPath, state)
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
