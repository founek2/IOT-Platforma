import React from 'react';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const styles = makeStyles({
    root: {
        width: 200
    },
    fullWidth: {
        width: "100%"
    }
})

function OwnSelect(props: any) {
    const classes = styles()
    const { label, value, onChange, onBlur, onFocus, name, autoFocus, selectOptions, FormHelperTextProps, helperText, required, error, className, fullWidth, ...other } = props;
    return (
        <FormControl className={clsx(fullWidth ? classes.fullWidth : classes.root, className)}>
            {label && <InputLabel htmlFor={`select-label-placeholder-${name}`} error={error}>{label}</InputLabel>}
            <Select
                onChange={onChange}
                value={value}
                error={error}
                required={required}
                onFocus={onFocus}
                onBlur={onBlur}
                name={name}
                autoFocus={autoFocus}
                {...other}
            >
                {selectOptions}
            </Select>
            {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
        </FormControl>
    );
}
OwnSelect.defaultProps = {
    value: ""
}
export default OwnSelect;