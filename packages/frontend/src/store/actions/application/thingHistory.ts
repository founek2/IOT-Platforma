import type { IDevice } from 'common/src/models/interface/device';
import { HistoricalSensor } from 'common/src/models/interface/history';
import type { IThing } from 'common/src/models/interface/thing';
import { Measurement } from 'common/src/types';
import { subDays } from 'date-fns';
import { logger } from 'framework-ui/src/logger';
import { getToken } from 'framework-ui/src/utils/getters';
import { AppThunk } from 'frontend/src/types';
import { fetchHistory as fetchHistoryApi } from '../../../api/thingApi';
import { thingHistoryReducerActions } from '../../reducers/application/thingHistory';

export const thingHistoryActions = {
    ...thingHistoryReducerActions,

    fetchHistory(deviceId: IDevice['_id'], thingId: IThing['_id']): AppThunk<Promise<boolean>> {
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
                    onSuccess: (json: { docs: Measurement[] }) => {
                        dispatch(thingHistoryActions.set({ data: json.docs, deviceId, thingId }));
                    },
                },
                dispatch
            );
        };
    },
};
