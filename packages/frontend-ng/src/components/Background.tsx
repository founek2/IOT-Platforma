import { Box, Paper } from '@mui/material';
import React from 'react';

export function Background({
    children,
    onContextMenu,
    onClick,
}: {
    children?: React.ReactNode;
    onContextMenu?: (event: React.MouseEvent) => any;
    onClick?: (event: React.MouseEvent) => any;
}) {
    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : 'rgb(5 0 0 / 70%)',
                minHeight: 'calc(100% - 64px)',
                paddingBottom: '64px',
                [theme.breakpoints.down('sm')]: {
                    minHeight: 'calc(100% - 56px)',
                    paddingBottom: '56px',
                },
            })}
        >
            <div style={{ minHeight: '100%' }} onContextMenu={onContextMenu} onClick={onClick}>
                {children}
            </div>
        </Box>
    );
}
