import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

export function App({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CssBaseline />
            {children}
        </>
    );
}
