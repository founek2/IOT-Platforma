import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextFieldProps,
    useMediaQuery,
    useTheme,
} from '@mui/material';

function PasswordField({ label, value, onChange, onBlur, onFocus, fullWidth, ...props }: TextFieldProps) {
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));

    const [showPsswd, setShowPsswd] = useState(false);
    return (
        <FormControl variant="standard" fullWidth={fullWidth}>
            <InputLabel htmlFor="standard-adornment-password">{label || ''}</InputLabel>
            <Input
                id="standard-adornment-password"
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
                            {showPsswd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                fullWidth={fullWidth}
            />
        </FormControl>
    );
}

export default PasswordField;
