import { getToken } from 'framework-ui/src/utils/getters';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Thing, thingsReducerActions } from '../store/slices/application/thingsSlice';
import { useLazyDevicesQuery } from '../endpoints/devices';
import { Device, devicesReducerActions } from '../store/slices/application/devicesSlice';
import { io, Socket } from 'socket.io-client';

export type SocketUpdateThingState = {
    _id: Device['_id'];
    thing: {
        _id: Thing['_id'];
        nodeId: Thing['config']['nodeId'];
        state: Thing['state'];
    };
};

function WebSocket() {
    const token = useAppSelector(getToken);
    const [lastFetchAt, setLastFetchAt] = useState<Date>();
    const [fetchDevices] = useLazyDevicesQuery();
    const dispatch = useAppDispatch();
    const ref = useRef<Socket>();

    useEffect(() => {
        if (token) {
            if (ref.current) {
                ref.current.close();
            }

            const newCon = io({
                path: '/socket.io',
                query: {
                    token,
                },
            });
            newCon.open();
            ref.current = newCon;
        }
    }, [token]);

    useEffect(() => {
        function updateDevice(payload: Device) {
            dispatch(devicesReducerActions.updateOne({ id: payload._id, changes: payload }));
        }

        function updateControl({ _id, thing }: SocketUpdateThingState) {
            console.log('web socket GOT', _id, thing);
            dispatch(
                thingsReducerActions.updateOneState({
                    id: thing._id,
                    changes: thing.state,
                })
            );
        }

        ref.current?.on('control', updateControl);
        ref.current?.on('device', updateDevice);

        return () => {
            ref.current?.off('device', updateDevice);
            ref.current?.off('control', updateControl);
        };
    }, [dispatch, ref]);

    useEffect(() => {
        let mounted = true;
        async function handler() {
            if (document.hidden) return;

            const isOld = !lastFetchAt || Date.now() - new Date(lastFetchAt).getTime() > 5 * 60 * 1000;

            if (token && (isOld || !ref.current?.connected)) {
                console.log('refreshing on focus');
                if ((await fetchDevices(undefined)) && mounted) setLastFetchAt(new Date());
            }
        }

        window.addEventListener('focus', handler);
        document.addEventListener('visibilitychange', handler, false);

        return () => {
            mounted = false;
            window.removeEventListener('focus', handler);
            document.removeEventListener('visibilitychange', handler);
        };
    }, [lastFetchAt, fetchDevices, ref]);

    return null;
}

export default WebSocket;
