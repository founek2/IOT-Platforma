import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import { daysInWeek } from '../../constants';
import clsx from 'clsx';
import FormLabel from '@material-ui/core/FormLabel';
import { assocPath, append, includes, o, __, ifElse, filter, equals, not } from 'ramda';

const notEqual = (el) => o(not, equals(el));

const styles = (theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        // [theme.breakpoints.down('sm')]: {
        //     width: `calc(90% - ${theme.spacing(2)}px)`
        // }
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    dayChip: {
        width: 40,
        height: 40,
        borderRadius: 30,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
        color: 'rgba(255, 255, 255, 0.78)',
        cursor: 'pointer',
        userSelect: 'none',
    },
    selected: {
        backgroundColor: 'green',
    },
    label: {
        fontSize: 12,
        textAlign: 'left',
    },
});

function DaysOfWeekPicker({ value = [], onChange, classes, error, FormHelperTextProps, helperText, label, ...other }) {
    function handleChange(num) {
        console.log('handle', num, value);
        const removeOrAdd = (el, array) =>
            ifElse(includes(__, array), o(filter(__, array), notEqual), append(__, array))(el);

        onChange({ target: { value: removeOrAdd(num, value) } });
    }

    return (
        <div className={classes.root}>
            <FormLabel className={classes.label}>{label}</FormLabel>
            <div className={classes.wrapper}>
                {daysInWeek.map(({ value: val, label }) => (
                    <div
                        key={val}
                        className={clsx(classes.dayChip, value.includes(val) && classes.selected)}
                        onClick={(e) => handleChange(val)}
                    >
                        {label}
                    </div>
                ))}
            </div>
            {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
        </div>
    );
}

export default withStyles(styles)(DaysOfWeekPicker);
