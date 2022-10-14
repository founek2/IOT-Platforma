import { Box, Paper } from '@mui/material';
import React from 'react';

export function Background({ children }: { children?: React.ReactNode }) {
    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'light' ? 'white' : 'rgba(0, 0, 0, 0.1)',
                height: 'calc(100% - 64px)',
                [theme.breakpoints.down('sm')]: {
                    height: 'calc(100% - 56px)',
                },
            })}
        >
            {children}
        </Box>
    );
}
