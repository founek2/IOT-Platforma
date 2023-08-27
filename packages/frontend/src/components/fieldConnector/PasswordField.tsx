import React, { useState } from 'react';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { TextFieldProps } from '@mui/material/TextField';
import { FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, useMediaQuery, useTheme } from '@mui/material';

function PasswordField({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    fullWidth,
    error,
    helperText,
    ...props
}: TextFieldProps) {
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));

    const [showPsswd, setShowPsswd] = useState(false);
    return (
        <FormControl variant="standard" fullWidth={fullWidth}>
            <InputLabel htmlFor="standard-adornment-password" error={error}>
                {label || ''}
            </InputLabel>
            <Input
                type={showPsswd ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onMouseUp={isWide ? () => setShowPsswd(false) : undefined}
                            onMouseDown={isWide ? () => setShowPsswd(true) : undefined}
                            onClick={isWide ? undefined : () => setShowPsswd(!showPsswd)}
                        >
                            {showPsswd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                }
                fullWidth={fullWidth}
                error={error}
            />
            {error ? (
                <FormHelperText sx={{ margin: 0 }} error={error}>
                    {helperText}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}

export default PasswordField;
