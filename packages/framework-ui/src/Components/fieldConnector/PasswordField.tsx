import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function PasswordField({ className, classes, ...props }: TextFieldProps) {
    const [showPsswd, setShowPsswd] = useState(false);
    return (
        <TextField
            type={showPsswd ? 'text' : 'password'}
            label="Password"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton aria-label="Toggle password visibility" onClick={() => setShowPsswd(!showPsswd)}>
                            {showPsswd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...props}
        />
    )
}
PasswordField.defaultProps = {
    value: ""
}

export default PasswordField