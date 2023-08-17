import { getToken } from 'framework-ui/src/utils/getters';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PropertyState, Thing, thingsReducerActions } from '../store/slices/application/thingsSlice';
import { useLazyDevicesQuery } from '../endpoints/devices';
import { Device, devicesReducerActions } from '../store/slices/application/devicesSlice';
import { io, Socket } from 'socket.io-client';
import { Discovery, discoveryReducerActions } from '../store/slices/application/discoverySlice';

export type SocketUpdateThingState = {
    _id: Device['_id'];
    thing: {
        _id: Thing['_id'];
        nodeId: Thing['config']['nodeId'];
        state: Record<string, PropertyState>;
    };
};

function WebSocket() {
    const token = useAppSelector(getToken);
    const [lastFetchAt, setLastFetchAt] = useState<Date>();
    const [fetchDevices] = useLazyDevicesQuery();
    const dispatch = useAppDispatch();
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        if (token) {
            if (socket) socket.close();

            const newCon = io({
                path: '/socket.io',
                query: {
                    token,
                },
            });
            newCon.open();
            setSocket(newCon);
        }
    }, [token]);

    useEffect(() => {
        if (!socket) return;

        function updateDevice(payload: Device) {
            console.log('web socket GOT device', payload);
            dispatch(devicesReducerActions.updateOne({ id: payload._id, changes: payload }));
        }

        function updateControl({ _id, thing }: SocketUpdateThingState) {
            console.log('web socket GOT thing', _id, thing);
            dispatch(
                thingsReducerActions.updateOneState({
                    id: thing._id,
                    changes: thing.state,
                })
            );
        }

        function addDiscoveredDevice(device: Discovery) {
            dispatch(discoveryReducerActions.upsertOne(device));
        }

        socket.on('control', updateControl);
        socket.on('device', updateDevice);
        socket.on('deviceDiscovered', addDiscoveredDevice);

        return () => {
            socket.off('device', updateDevice);
            socket.off('control', updateControl);
            socket.off('deviceDiscovered', addDiscoveredDevice);
        };
    }, [dispatch, socket]);

    useEffect(() => {
        let mounted = true;
        async function handler() {
            if (document.hidden) return;

            const isOld = !lastFetchAt || Date.now() - new Date(lastFetchAt).getTime() > 5 * 60 * 1000;

            if (token && (isOld || socket?.connected)) {
                console.log('refreshing on focus');
                // Add little bit of timeout to give device time to setup network after waking from sleep
                setTimeout(async () => {
                    if (mounted) await fetchDevices(undefined)

                    if (mounted) setLastFetchAt(new Date());
                }, window.navigator.onLine ? 0 : 500);
            }
        }

        window.addEventListener('focus', handler);
        document.addEventListener('visibilitychange', handler, false);

        return () => {
            mounted = false;
            window.removeEventListener('focus', handler);
            document.removeEventListener('visibilitychange', handler);
        };
    }, [lastFetchAt, fetchDevices, socket]);

    return null;
}

export default WebSocket;
