import { Grid, TextField } from '@mui/material';
import React from 'react';

export function HomePage() {
    return (
        <Grid container spacing={{ xs: 2 }}>
            <Grid item xs={12}>
                <TextField label="user name" fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField label="neco" fullWidth />
            </Grid>
            <Grid item>
                <TextField />
            </Grid>
            dfsdf
        </Grid>
    );
}
