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
            if (await actions.fetchDevicesA()) setLastFetchAt(new Date());
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
            const isOld = !lastFetchAt || Date.now() - new Date(lastFetchAt).getTime() > 10 * 60 * 1000;
            if (isOld) {
                if ((await actions.fetchDevicesA()) && mounted) setLastFetchAt(new Date());
            }
        }
        window.addEventListener('focus', handler);

        return () => {
            mounted = false;
            window.removeEventListener('focus', handler);
        };
    }, [actions, lastFetchAt]);
}
