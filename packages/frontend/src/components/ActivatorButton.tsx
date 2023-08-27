import React from 'react';
import { PowerSettingsNew as PowerSettingsNewIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

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
