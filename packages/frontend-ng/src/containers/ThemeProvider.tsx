import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';
import { orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const theme = createTheme({
    status: {
        danger: orange[500],
    },
});

export function MyThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CssBaseline />
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </>
    );
}
