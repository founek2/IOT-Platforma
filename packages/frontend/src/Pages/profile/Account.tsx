import { Button, Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../selectors/getters.js';

function Account() {
    const user = useSelector(getCurrentUser);
    const navigate = useNavigate();

    if (!user) return <p>Načítám data...</p>;

    return (
        <Grid container>
            <Button variant='contained' onClick={() => navigate({ search: `?editUser=current` })}>Upravit informace</Button>
        </Grid>
    );
}

export default Account;
