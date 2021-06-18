import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuthorizeHref } from '../oauthConfig';
import { authorizationActions } from '../store/actions/application/authorization';
import { RootState } from '../store/store';
import { useHistory } from 'react-router';
import { useAppDispatch } from '../hooks';
import { Typography } from '@material-ui/core';
import Loader from 'framework-ui/lib/Components/Loader';

export function Authorization() {
    const { code } = useSelector((state: RootState) => state.history.query);
    const history = useHistory();
    const [pending, setPending] = useState(false);
    // const tokenExpiryDate = useSelector((state));
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function send(code: string) {
            setPending(true);
            const result = await dispatch(authorizationActions.sendCode(code));
            if (result) history.push('/devices');
            else history.push({ search: '', hash: 'login' });
            setPending(false);
        }
        if (code && !pending) {
            send(code);
        }
    }, [code, setPending, history]);

    return (
        <>
            <Typography>Probíhá přihlašování... </Typography>
            <Loader open={pending} />
        </>
    );
}
