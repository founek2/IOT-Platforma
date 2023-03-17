import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { useLongPress } from '../hooks/useLongPress';

export function Background({
    children,
    onContextMenu,
    onClick,
}: {
    children?: React.ReactNode;
    onContextMenu?: (e: React.MouseEvent) => any;
    onClick?: (event: React.MouseEvent) => any;
}) {
    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : 'rgba(0, 0, 0, 0.7)',
                minHeight: 'calc(100% - 64px)',
                paddingBottom: '64px',
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.down('sm')]: {
                    minHeight: 'calc(100% - 56px)',
                    paddingBottom: '56px',
                },
            })}
        >
            <Container />
            <div style={{ minHeight: '100%', flex: 1 }} onContextMenu={onContextMenu} onClick={onClick}>
                {children}
            </div>
        </Box>
    );
}
