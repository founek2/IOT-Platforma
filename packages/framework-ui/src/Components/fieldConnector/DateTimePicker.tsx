import React from 'react';
import {
    DateTimePicker,
} from '@material-ui/pickers';


//    const { label, value, onChange, onBlur, onFocus, name, autoFocus, selectOptions, FormHelperTextProps, helperText, required, error, className, ...other } = props;
function MyDateTimePicker({ onChange, value, fieldProps, ...props }: any) {
    return (
        <DateTimePicker value={value} onChange={(date) => {
            console.log("data", date)
            onChange({ target: { value: date } })
        }} {...fieldProps} {...props} ampm={false} />
    );
}

export default MyDateTimePicker