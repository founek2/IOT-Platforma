import { getToken } from 'framework-ui/src/utils/getters';
import React, { useEffect } from 'react';
import { useAppSelector } from 'src/hooks';
import webSocket from '../webSocket';

function WebSocket({ children }: { children: JSX.Element | JSX.Element[] }) {
    const token = useAppSelector(getToken);
    useEffect(() => {
        webSocket.init(token);
    }, [token]);

    return <>{children}</>;
}

export default WebSocket;
