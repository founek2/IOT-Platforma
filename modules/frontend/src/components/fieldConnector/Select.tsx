import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Select, { SelectProps } from '@mui/material/Select';
import { MenuItem } from '@mui/material';

export interface SelectOption {
    label: string;
    value: any;
}

function SelectField({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    fullWidth,
    error,
    helperText,
    options,
    FormHelperTextProps,
    ...props
}: SelectProps & { helperText?: string, options: SelectOption[], FormHelperTextProps: any }) {
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));

    const [showPsswd, setShowPsswd] = useState(false);
    return (
        <FormControl variant="standard" fullWidth={fullWidth}>
            <InputLabel htmlFor="standard-adornment-select" error={error}>
                {label || ''}
            </InputLabel>
            <Select
                label={label}
                type={showPsswd ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                fullWidth={fullWidth}
                error={error}
                {...props}
            >
                {options.map(({ value, label }) => (
                    <MenuItem value={value} key={value}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
            {error ? (
                <FormHelperText sx={{ margin: 0 }} error={error}>
                    {helperText}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}

export default SelectField;
