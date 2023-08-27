import { Box, Container } from '@mui/material';
import React from 'react';

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
