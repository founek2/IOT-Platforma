import { Update } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '.';
import { devicesActions } from '../store/actions/application/devices';
import { Device } from '../store/reducers/application/devices';
import io from '../webSocket';
import { useActions } from './useActions';

export function useEffectFetchDevices() {
    const dispatch = useAppDispatch();
    const [lastFetchAt, setLastFetchAt] = useState<Date>();
    const updateDevice = useCallback(() => {
        return (payload: Update<Device>) => {
            console.log('payload', payload);
            dispatch(devicesActions.updateOne(payload));
        };
    }, [dispatch]);

    useEffect(() => {
        let mounted = true;

        async function run() {
            if ((await dispatch(devicesActions.fetch())) && mounted) setLastFetchAt(new Date());
        }
        run();

        io.getSocket().on('device', updateDevice);

        return () => {
            io.getSocket().off('device', updateDevice);
            mounted = false;
        };
    }, [dispatch, updateDevice]);

    useEffect(() => {
        let mounted = true;
        async function handler() {
            if (document.hidden) return;

            const isOld = !lastFetchAt || Date.now() - new Date(lastFetchAt).getTime() > 10 * 60 * 1000;

            if (isOld || !io.getSocket().isConnected()) {
                if ((await dispatch(devicesActions.fetch())) && mounted) setLastFetchAt(new Date());
            }
        }

        window.addEventListener('focus', handler);
        document.addEventListener('visibilitychange', handler, false);

        return () => {
            mounted = false;
            window.removeEventListener('focus', handler);
            document.removeEventListener('visibilitychange', handler);
        };
    }, [lastFetchAt, dispatch]);
}
