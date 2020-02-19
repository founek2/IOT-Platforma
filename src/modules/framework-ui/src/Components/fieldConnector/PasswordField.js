import React, {useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import styles from './styles'

function PasswordField({className, classes, ...props}) {
	const [showPsswd, setShowPsswd] = useState(false);
     return (
          <TextField
			className={`${classes.textField} ${className || ""}`}
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

export default withStyles(styles)(PasswordField)
