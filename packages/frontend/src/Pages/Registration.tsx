import React, { useEffect, useState } from 'react';
import EditUserForm from '../components/EditUserForm.js';
import { RegisterUserForm, useRegisterAndSignInMutation, useRegisterMutation } from '../endpoints/users.js';
import { useForm } from '../hooks/useForm.js';
import { Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, Grid } from '@mui/material';

export default function Registration() {
    const [registerAndSignIn, setRegisterAndSignIn] = useState(true);
    const { validateForm, resetForm } = useForm<RegisterUserForm>('REGISTRATION');
    const [registerAndSignInMutation] = useRegisterAndSignInMutation();
    const [registerMutation] = useRegisterMutation();

    useEffect(() => {
        resetForm();
    }, []);

    async function handleRegister() {
        const result = validateForm();
        if (!result.valid) return;

        (registerAndSignIn ? registerAndSignInMutation(result.data) : registerMutation(result.data))
            .unwrap()
            .then(() => resetForm())
            .catch(() => { });
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={7} lg={6} xl={4}>
                <Card sx={{ padding: 2 }}>
                    <CardContent>
                        <EditUserForm formName="REGISTRATION" />
                    </CardContent>
                    <CardActions sx={(theme) => ({ [theme.breakpoints.up('md')]: { justifyContent: 'center' } })}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={registerAndSignIn}
                                    onChange={(e, value) => setRegisterAndSignIn(value)}
                                />
                            }
                            label="Po registraci přihlásit"
                        />
                        <Button onClick={handleRegister}>Registrovat</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}
