import { useEffect } from 'react';
import io from '../webSocket';
import { devicesActions } from '../store/actions/application/devices';
import { useDispatch, useSelector } from 'react-redux';
import { IDevice } from 'common/lib/models/interface/device';
import { IState } from '../types';
import { path } from 'ramda';
import { getApplication } from 'framework-ui/lib/utils/getters';
import { useActions } from './useActions';
import { SocketUpdateThingState } from 'common/lib/types';

export function useEffectFetchDevices() {
    const actions = useActions({
        fetchDevicesA: devicesActions.fetch,
        updateDeviceA: devicesActions.update,
    });

    const devicesLastFetch = useSelector<IState>((state) => path(['devices', 'lastFetch'], getApplication(state))) as
        | Date
        | undefined;

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
                console.log('downloading devices');
            }
        }
        window.addEventListener('focus', handler);

        return () => window.removeEventListener('focus', handler);
    }, [actions, devicesLastFetch]);
}
