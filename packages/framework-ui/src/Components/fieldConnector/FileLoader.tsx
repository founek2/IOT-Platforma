import React from 'react';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import AddIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import { logger } from '../../logger';
import clsx from 'clsx';

export class MyFile {
    name: string;
    data: any;
    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-flex',
    },
    button: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    inputWrapper: {
        width: '100%',
    },
    //  textField: fieldStyle(theme).textField
}));

function FileLoader({ onChange, label, value, className, FormHelperTextProps, helperText, error, ...other }: any) {
    const classes = useStyles();

    async function handleChange(e: any) {
        e.preventDefault();
        const { files } = e.target;
        if (files.length === 0) {
        } else if (files.length === 1) {
            const localImageUrl = window.URL.createObjectURL(files[0]);
            // const res = await fetch(localImageUrl)
            // const blob = await res.blob()

            onChange({ target: { value: new MyFile(files[0].name, localImageUrl) } });
        } else {
            logger.error('Multiple files are not currently supported');
        }
    }

    return (
        <div className={clsx(className, classes.root)}>
            <div className={classes.inputWrapper}>
                <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
                <Input
                    id="standard-adornment-password"
                    value={value?.name ? value.name : value}
                    // onChange={handleChange('password')}
                    fullWidth
                    disabled={true}
                    error={error}
                    {...other}
                />
                {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
            </div>
            {/* <TextField value={value.name} disabled label={label} fullWidth {...other} /> */}
            <div>
                <Fab color="primary" aria-label="Add" size="small" className={classes.button} component="label">
                    <input type="file" style={{ display: 'none' }} onChange={handleChange} />
                    <AddIcon />
                </Fab>
            </div>
        </div>
    );
}

export default FileLoader;
