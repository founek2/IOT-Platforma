import React from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FormControl } from '@material-ui/core';

type MyAutocompleteProps = TextFieldProps & { numeric: boolean, options: string[] }

function MyAutocomplete({ onChange, onBlur, numeric, error, helperText, FormHelperTextProps, autoComplete, options, ...props }: any) {
    return <FormControl fullWidth={Boolean(props.fullWidth)} ><Autocomplete
        options={options || []}
        {...props}
        onChange={(e, value) => {
            if (onChange) onChange({ target: { value } })
        }}
        renderInput={(params) => {
            return <TextField {...params} onChange={onChange} label={props.label} />
        }}
        autoComplete={Boolean(autoComplete)}
    />
        {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
    </FormControl>
}

export default MyAutocomplete