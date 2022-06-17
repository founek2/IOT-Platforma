import { Typography } from '@material-ui/core';
import Loader from 'framework-ui/src/Components/Loader';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { authorizationActions } from '../store/actions/application/authorization';
import { RootState } from '../store/store';
import { buildRedirectUri } from '../utils/redirectUri';

export function Authorization() {
    const { code, error } = useSelector((state: RootState) => state.history.query);
    const history = useHistory();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState('Probíhá přihlašování...');
    // const tokenExpiryDate = useSelector((state));
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function send(code: string) {
            setPending(true);
            const result = await dispatch(authorizationActions.sendCode(code, buildRedirectUri()));
            if (result) history.push('/devices');
            else {
                setMessage('Při přihlašování nastala chyba, akci opakujte');
                history.push({ search: '' }); // clear code
                setPending(false);
            }
        }
        if (code && !pending) {
            send(code);
        }
    }, [code, setPending, history, dispatch, pending]);

    useEffect(() => {
        if (error) {
            setMessage('Při přihlašování nastala chyba, akci opakujte');
            setPending(false);
        }
    }, [error, setPending, setMessage]);

    return (
        <>
            <Typography>{message}</Typography>
            <Loader open={pending} />
        </>
    );
}
