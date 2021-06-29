import type { IDevice } from 'common/lib/models/interface/device';
import { IDiscovery } from 'common/lib/models/interface/discovery';
import { baseLogger } from 'framework-ui/lib/logger';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { getFormData, getToken } from 'framework-ui/lib/utils/getters';
import { addDiscoveredDevice, deleteDiscovery, fetchDiscovery } from '../../../api/discovery';
import { ActionTypes } from '../../../constants/redux';
import { devicesActions } from './devices';
import { discoveryReducerActions } from '../../reducers/application/discovery';
import { AppThunk } from 'frontend/src/types';

export const discoveryActions = {
    ...discoveryReducerActions,

    fetch(): AppThunk {
        return function (dispatch, getState) {
            baseLogger('FETCH_DISCOVERED_DEVICES');
            return fetchDiscovery(
                {
                    token: getToken(getState()),
                    onSuccess: (json: { docs: IDiscovery[] }) => {
                        dispatch(discoveryActions.set(json.docs));
                    },
                },
                dispatch
            );
        };
    },

    deleteDevices(): AppThunk {
        return function (dispatch, getState) {
            baseLogger('DELETE_DISCOVERED_DEVICES');

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
            baseLogger('CREATE_DEVICE');

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
                            dispatch(devicesActions.add(json.doc));
                        },
                    },
                    dispatch
                );
            }
        };
    },
};
