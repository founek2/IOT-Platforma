import { path } from 'ramda';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { devicesActions } from '../store/actions/application/devices';
import io from '../webSocket';
import { useActions } from './useActions';
import { RootState } from '../store/store';
import { getApplication } from '../utils/getters';

export function useEffectFetchDevices() {
    const actions = useActions({
        fetchDevicesA: devicesActions.fetch,
        updateDeviceA: devicesActions.update,
    });

    const devicesLastFetch = useSelector<RootState>((state) =>
        path(['devices', 'lastFetch'], getApplication(state))
    ) as Date | undefined;

    useEffect(() => {
        actions.fetchDevicesA();

        io.getSocket().on('device', actions.updateDeviceA);

        return () => {
            io.getSocket().off('device', actions.updateDeviceA);
        };
    }, [actions]);

    useEffect(() => {
        function handler() {
            const isOld = !devicesLastFetch || Date.now() - new Date(devicesLastFetch).getTime() > 20 * 60 * 1000;
            if (!io.getSocket().isConnected() || isOld) {
                actions.fetchDevicesA();
            }
        }
        window.addEventListener('focus', handler);

        return () => window.removeEventListener('focus', handler);
    }, [actions, devicesLastFetch]);
}
