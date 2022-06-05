import React, { Fragment } from 'react';
import Input, { InputProps } from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
    container: {
        width: 250,
    },
});

function SearchField(props: InputProps) {
    const classes = useStyles();

    return (
        <FormControl className={classes.container}>
            <Input
                id="input-with-icon-search"
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
                {...props}
            />
        </FormControl>
    );
}

export default SearchField;
