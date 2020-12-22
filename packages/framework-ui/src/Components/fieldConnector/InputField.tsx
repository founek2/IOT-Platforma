import React from 'react';
import Input, { InputProps } from '@material-ui/core/Input';

function InputField({ helperText, ...props }: any) {
    return <Input {...props} />

}
export default InputField