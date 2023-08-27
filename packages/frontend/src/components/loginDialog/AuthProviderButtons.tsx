import React from 'react';
import { AuthProvider } from '../../endpoints/signIn.js';
import { IconButton, Paper } from '@mui/material';

function AuthProviderButtons({ providers }: { providers: AuthProvider[] }) {
    return (
        <Paper
            elevation={1}
            sx={{
                width: 110,
                height: 70,
                backgroundColor: 'primary.main',
                display: 'flex',
                flexItems: 'center',
                justifyContent: 'center',
            }}
        >
            {providers.map(({ provider, authUrl, iconUrl }) => (
                <IconButton key={provider} onClick={() => window.open(authUrl, '_self')}>
                    <img src={iconUrl} alt={provider} />
                </IconButton>
            ))}
        </Paper>
    );
}

export default AuthProviderButtons;
