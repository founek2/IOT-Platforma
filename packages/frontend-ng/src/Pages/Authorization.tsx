import { CircularProgress, Typography } from '@mui/material';
import { logger } from 'common/src/logger';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSignInOauthMutation } from '../services/signIn';
import { buildRedirectUri } from '../utils/redirectUri';

export function Authorization() {
    const [searchParams] = useSearchParams();
    const { code, error }: Partial<{ code: string; error: string }> = Object.fromEntries(searchParams.entries());
    const navigate = useNavigate();
    const [message, setMessage] = useState('Probíhá přihlašování...');
    const [signIn, { isLoading }] = useSignInOauthMutation();

    useEffect(() => {
        if (!code) return;

        signIn({ code, redirectUri: buildRedirectUri() })
            .unwrap()
            .then(() => {
                navigate('/devices');
            })
            .catch((err) => {
                logger.error('failed signIn by oauth code', err);
                setMessage('Při přihlašování nastala chyba, akci opakujte');
                navigate({ search: '' }); // clear code
            });
    }, [code, history]);

    useEffect(() => {
        if (error) {
            setMessage('Při přihlašování nastala chyba, akci opakujte');
        }
    }, [error, setMessage]);

    return (
        <div className="utils--center">
            <Typography component="span" pt={2}>
                {message}
            </Typography>
            {true ? <CircularProgress /> : null}
        </div>
    );
}
