import React, { Fragment } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
    width: 250
}

function SearchField({ classes, ...props }) {
    return <FormControl className={classes.margin}>
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
}

export default withStyles(styles)(SearchField)