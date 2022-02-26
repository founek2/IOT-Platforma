import { useEffect, useState } from 'react';
import { devicesActions } from '../store/actions/application/devices';
import io from '../webSocket';
import { useActions } from './useActions';

export function useEffectFetchDevices() {
    const actions = useActions({
        fetchDevicesA: devicesActions.fetch,
        updateDeviceA: devicesActions.updateOne,
    });
    const [lastFetchAt, setLastFetchAt] = useState<Date>();

    useEffect(() => {
        let mounted = true;

        async function run() {
            if ((await actions.fetchDevicesA()) && mounted) setLastFetchAt(new Date());
        }
        run();

        io.getSocket().on('device', actions.updateDeviceA);

        return () => {
            io.getSocket().off('device', actions.updateDeviceA);
            mounted = false;
        };
    }, [actions]);

    useEffect(() => {
        let mounted = true;
        async function handler() {
            if (document.hidden) return;

            const isOld = !lastFetchAt || Date.now() - new Date(lastFetchAt).getTime() > 10 * 60 * 1000;

            if (isOld || !io.getSocket().isConnected()) {
                if ((await actions.fetchDevicesA()) && mounted) setLastFetchAt(new Date());
            }
        }

        window.addEventListener('focus', handler);
        document.addEventListener('visibilitychange', handler, false);

        return () => {
            mounted = false;
            window.removeEventListener('focus', handler);
            document.removeEventListener('visibilitychange', handler);
        };
    }, [actions, lastFetchAt]);
}
