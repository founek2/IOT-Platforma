import React, { useState } from 'react';
import Search from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';

export default function SearchField({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    fullWidth,
    error,
    helperText,
    onClick,
    sx,
    ...props
}: TextFieldProps & { onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
    return (
        <FormControl variant="standard" fullWidth={fullWidth} sx={sx}>
            <InputLabel htmlFor="standard-adornment-password" error={error}>
                {label || ''}
            </InputLabel>
            <Input
                id="standard-adornment-password"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={onClick}>
                            <Search />
                        </IconButton>
                    </InputAdornment>
                }
                fullWidth={fullWidth}
                error={error}
            />
            {error ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}
