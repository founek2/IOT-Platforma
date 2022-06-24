import type { IDevice } from 'common/src/models/interface/device';
import { IDiscovery } from 'common/src/models/interface/discovery';
import { logger } from 'framework-ui/src/logger';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { getFormData, getToken } from 'framework-ui/src/utils/getters';
import { AppThunk } from 'frontend/src/types';
import { normalizeDevice } from 'frontend/src/utils/normalizers';
import { addDiscoveredDevice, deleteDiscovery, fetchDiscovery } from '../../../api/discovery';
import { discoveryReducerActions, Discovery } from '../../reducers/application/discovery';
import { thingsReducerActions } from '../../reducers/application/things';
import { devicesActions } from './devices';

export const discoveryActions = {
    ...discoveryReducerActions,

    fetch(): AppThunk {
        return function (dispatch, getState) {
            logger.info('FETCH_DISCOVERED_DEVICES');
            return fetchDiscovery(
                {
                    token: getToken(getState()),
                    params: {},
                    onSuccess: (json: { docs: Discovery[] }) => {
                        dispatch(discoveryActions.set(json.docs));
                    },
                },
                dispatch
            );
        };
    },

    deleteDevices(): AppThunk {
        return function (dispatch, getState) {
            logger.info('DELETE_DISCOVERED_DEVICES');

            const DISCOVERY_DEVICES = 'DISCOVERY_DEVICES';
            const result = dispatch(formsDataActions.validateForm(DISCOVERY_DEVICES));
            if (result.valid) {
                const formData = getFormData(DISCOVERY_DEVICES)(getState()) as any;
                formData.selected.map((id: IDiscovery['_id']) => {
                    return deleteDiscovery(
                        {
                            token: getToken(getState()),
                            id,
                            onSuccess: () => {
                                dispatch(discoveryActions.remove(id));
                            },
                        },
                        dispatch
                    );
                });
            }
        };
    },

    addDevice(id: IDiscovery['_id']): AppThunk {
        return function (dispatch, getState) {
            logger.info('CREATE_DEVICE');

            const CREATE_DEVICE = 'CREATE_DEVICE';
            const result = dispatch(formsDataActions.validateForm(CREATE_DEVICE));
            if (result.valid) {
                const formData = getFormData(CREATE_DEVICE)(getState()) as any;
                return addDiscoveredDevice(
                    {
                        token: getToken(getState()),
                        id,
                        body: { formData: { [CREATE_DEVICE]: formData } },
                        onSuccess: (json: { doc: IDevice }) => {
                            dispatch(discoveryActions.remove(id));
                            const { device, things } = normalizeDevice(json.doc);
                            dispatch(devicesActions.addOne(device));
                            dispatch(thingsReducerActions.addMany(things));
                        },
                    },
                    dispatch
                );
            }
        };
    },
};
