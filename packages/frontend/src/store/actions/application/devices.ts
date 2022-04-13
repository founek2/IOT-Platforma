import { IDevice } from 'common/lib/models/interface/device';
import { IThing } from 'common/lib/models/interface/thing';
import { transformNotifyForFE } from 'common/lib/utils/transform';
import { logger } from 'framework-ui/lib/logger';
import { dehydrateState } from 'framework-ui/lib/redux/actions';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { getFormData, getToken } from 'framework-ui/lib/utils/getters';
import {
    deleteDevice as deleteDeviceApi,
    fetchDevices as fetchDevicesApi,
    getNotify as getNotifyApi,
    postDevice as postDeviceApi,
    updateDevice as updateDeviceApi,
    updateNotify as updateNotifyApi,
} from '../../../api/deviceApi';
import { updateState as updateStateThingApi } from '../../../api/thingApi';
import { devicesReducerActions } from '../../reducers/application/devices';
import { AppThunk } from 'frontend/src/types';
import { normalizeDevices } from 'frontend/src/utils/normalizers';
import { thingsReducerActions } from '../../reducers/application/things';
import { getThing } from 'frontend/src/utils/getters';
import { mergeDeepLeft } from 'ramda';

export const devicesActions = {
    ...devicesReducerActions,
    updateDevice(id: IDevice['_id']): AppThunk {
        return async function (dispatch, getState) {
            const EDIT_DEVICE = 'EDIT_DEVICE';
            logger.info(EDIT_DEVICE);
            const result = dispatch(formsDataActions.validateRegisteredFields(EDIT_DEVICE));
            if (result.valid) {
                const state = getState();
                const formData: any = getFormData(EDIT_DEVICE)(state);

                return updateDeviceApi(
                    {
                        body: { formData: { [EDIT_DEVICE]: formData } },
                        token: getToken(state),
                        onSuccess: () => {
                            dispatch(devicesActions.updateOne({ ...formData, _id: id }));
                            dispatch(dehydrateState());
                        },
                        id,
                    },
                    dispatch
                );
            }
        };
    },

    deleteDevice(id: IDevice['_id']): AppThunk {
        return async function (dispatch, getState) {
            logger.info('DELETE_DEVICE');
            return deleteDeviceApi(
                {
                    token: getToken(getState()),
                    id,
                    onSuccess: () => {
                        dispatch(devicesActions.removeOne(id));
                    },
                },
                dispatch
            );
        };
    },

    fetch(): AppThunk<Promise<boolean>> {
        return function (dispatch, getState) {
            logger.info('FETCH_DEVICES');
            return fetchDevicesApi(
                {
                    token: getToken(getState()),
                    onSuccess: (json: { docs: IDevice[] }) => {
                        const normilized = normalizeDevices(json.docs);
                        dispatch(devicesActions.setAll(normilized.entities.devices as any));
                        dispatch(thingsReducerActions.setAll(normilized.entities.things as any));
                        dispatch(dehydrateState());
                    },
                },
                dispatch
            );
        };
    },

    updateState(deviceId: IDevice['_id'], thingId: IThing['_id'], state: any): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const EDIT_CONTROL = 'UPDATE_STATE_DEVICE';
            logger.info(EDIT_CONTROL);

            const nodeId = getThing(thingId)(getState())?.config.nodeId;
            if (!nodeId) logger.error('Invalid thingId', thingId);

            return updateStateThingApi(
                {
                    token: getToken(getState()),
                    deviceId,
                    nodeId,
                    body: { state },
                    onSuccess: () => {
                        const thing = getThing(thingId)(getState())!;
                        const mergedState = thing.state
                            ? mergeDeepLeft(
                                  {
                                      value: state,
                                  },
                                  thing.state
                              )
                            : { timestamp: new Date(), value: {} };
                        dispatch(
                            thingsReducerActions.updateOne({
                                id: thingId,
                                changes: {
                                    state: mergedState,
                                },
                            })
                        );
                    },
                },
                dispatch
            );
        };
    },

    prefillNotify(deviceId: IDevice['_id'], nodeId: IThing['config']['nodeId']): AppThunk {
        return async function (dispatch, getState) {
            return getNotifyApi(
                {
                    token: getToken(getState()),
                    id: deviceId,
                    nodeId,
                    onSuccess: (json: any) => {
                        const formData = transformNotifyForFE(json.doc.thing.properties);
                        dispatch(formsDataActions.setFormData({ formName: 'EDIT_NOTIFY', data: formData }));
                    },
                },
                dispatch
            );
        };
    },

    updateNotify(id: IDevice['_id'], nodeId: IThing['config']['nodeId']): AppThunk {
        return async function (dispatch, getState) {
            const EDIT_NOTIFY = 'EDIT_NOTIFY';
            logger.info(EDIT_NOTIFY);
            const result = dispatch(formsDataActions.validateForm(EDIT_NOTIFY));
            const formData = getFormData(EDIT_NOTIFY)(getState());
            if (result.valid) {
                return updateNotifyApi(
                    {
                        token: getToken(getState()),
                        id,
                        nodeId,
                        body: { formData: { [EDIT_NOTIFY]: formData } },
                        onSuccess: () => {
                            // const formData = transformNotifyForFE(json.doc.thing.properties);
                            // dispatch(fillForm("EDIT_NOTIFY")(formData));
                        },
                    },
                    dispatch
                );
            }
        };
    },

    sendCommand(deviceId: IDevice['_id']): AppThunk {
        return async function (dispatch, getState) {
            const DEVICE_SEND = 'DEVICE_SEND';
            logger.info(DEVICE_SEND);
            const result = dispatch(formsDataActions.validateForm(DEVICE_SEND));
            const formData = getFormData(DEVICE_SEND)(getState());
            if (result.valid) {
                return postDeviceApi(
                    {
                        token: getToken(getState()),
                        id: deviceId,
                        body: { formData: { [DEVICE_SEND]: formData } },
                    },
                    dispatch
                );
            }
        };
    },
};
