import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles({
    button: {
        padding: '6px 18px 6px 18px',
    },
});

interface ActivatorProps {
    disabled?: boolean;
    onClick: () => any;
}
export function ActivatorButton({ disabled, onClick }: ActivatorProps) {
    const classes = useStyles();

    return (
        <IconButton className={classes.button} disabled={disabled} onClick={onClick}>
            <PowerSettingsNewIcon fontSize="large" />
        </IconButton>
    );
}
