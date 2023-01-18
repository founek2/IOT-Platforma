import React from 'react';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import IconButton from '@mui/material/IconButton';

interface ActivatorProps {
    disabled?: boolean;
    onClick: () => any;
}
export function ActivatorButton({ disabled, onClick }: ActivatorProps) {
    return (
        <IconButton disabled={disabled} onClick={onClick}>
            <PowerSettingsNewIcon fontSize="large" />
        </IconButton>
    );
}
