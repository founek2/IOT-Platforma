import React from 'react';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core'
import Input from '@material-ui/core/Input';
import styles from './fieldConnector/styles'

function OwnSelect(props) {
     const { label, value, onChange, onBlur, onFocus, name, autoFocus, selectOptions, FormHelperTextProps, helperText, required, error, className, classes, ...other } = props;
     return (
          <FormControl className={`${classes.textField} ${className || ""}`}>
               {label && <InputLabel htmlFor={`select-label-placeholder-${name}`}>{label}</InputLabel>}
               <Select
                    onChange={onChange}
                    value={value}
                    error={error}
                    required={required}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    name={name}
                    autoFocus={autoFocus}
                    input={<Input name={name} id={`select-label-placeholder-${name}`} />}
                    {...other}
               >
                    {selectOptions}
               </Select>
               {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
          </FormControl>
     );
}
OwnSelect.defaultProps = {
     value: ""
}
export default withStyles(styles)(OwnSelect);
