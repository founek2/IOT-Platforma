import type { IDevice } from 'common/lib/models/interface/device';
import { HistoricalSensor } from 'common/lib/models/interface/history';
import type { IThing } from 'common/lib/models/interface/thing';
import { subDays } from 'date-fns';
import { logger } from 'framework-ui/lib/logger';
import { getToken } from 'framework-ui/lib/utils/getters';
import { AppThunk } from 'frontend/src/types';
import { fetchHistory as fetchHistoryApi } from '../../../api/thingApi';
import { thingHistoryReducerActions } from '../../reducers/application/thingHistory';

export const thingHistoryActions = {
    ...thingHistoryReducerActions,

    fetchHistory(deviceId: IDevice['_id'], thingId: IThing['_id']): AppThunk {
        return function (dispatch, getState) {
            logger.info('FETCH_DISCOVERED_DEVICES');
            return fetchHistoryApi(
                {
                    deviceId,
                    thingId,
                    token: getToken(getState()),
                    params: {
                        from: subDays(new Date(), 1).getTime(),
                    },
                    onSuccess: (json: { docs: HistoricalSensor[] }) => {
                        dispatch(thingHistoryActions.set({ data: json.docs, deviceId, thingId }));
                    },
                },
                dispatch
            );
        };
    },
};
