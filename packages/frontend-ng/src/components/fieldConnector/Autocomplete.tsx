import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import AutocompleteMui from '@mui/material/Autocomplete';

export interface AutocompleteOption {
    label: string;
    value: any;
}
export interface AutocompleteProps {
    options: { label: string; value: any }[];
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
    variant?: 'filled' | 'outlined' | 'standard';
}
export default function Autocomplete({
    options,
    label,
    onChange,
    error,
    helperText,
    FormHelperTextProps,
    variant,
    ...props
}: AutocompleteProps) {
    return (
        <AutocompleteMui
            disablePortal
            options={options}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                    FormHelperTextProps={FormHelperTextProps}
                    variant={variant}
                />
            )}
            onChange={(e, value) => {
                onChange({ target: { value: value.value } });
            }}
            isOptionEqualToValue={(option, value) => option.value === value}
            {...props}
        />
    );
}
