import React from 'react';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

function OwnSelect(props) {
     const { label, value, onChange, onBlur, onFocus, name, autoFocus, selectOptions, FormHelperTextProps, helperText, required, error, className, ...other } = props;
     return (
          <FormControl className={className}>
               {label && <InputLabel htmlFor={`select-label-placeholder-${name}`}>{label}</InputLabel>}
               <Select
                    onChange={onChange}
                    value={value || ''}
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
               <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>
          </FormControl>
     );
}

export default OwnSelect;
