import { transformNotifyForFE } from 'common/lib/utils/transform';
import { baseLogger } from 'framework-ui/lib/logger';
import { dehydrateState } from 'framework-ui/lib/redux/actions';
import { fillForm, validateForm, validateRegisteredFields } from 'framework-ui/lib/redux/actions/formsData';
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
import { ActionTypes } from '../../../constants/redux';

export function update(device) {
    return {
        type: ActionTypes.UPDATE_DEVICE,
        payload: device,
    };
}

export function remove(id) {
    return {
        type: ActionTypes.REMOVE_DEVICE,
        payload: id,
    };
}

export function add(data) {
    return {
        type: ActionTypes.ADD_DEVICE,
        payload: data,
    };
}

export function updateThing(data) {
    return {
        type: ActionTypes.UPDATE_THING,
        payload: data,
    };
}

export function set(data) {
    return {
        type: ActionTypes.SET_DEVICES,
        payload: data,
    };
}

function getBuilding(device) {
    return device.info.location.building;
}
function getRoom(device) {
    return device.info.location.room;
}
function sortDevices(a, b) {
    const comp1 = getBuilding(a).localeCompare(getBuilding(b));
    if (comp1 !== 0) return 0;
    return getRoom(a).localeCompare(getRoom(b));
}

export function updateDevice(id) {
    return async function (dispatch, getState) {
        const EDIT_DEVICE = 'EDIT_DEVICE';
        baseLogger(EDIT_DEVICE);
        const result = dispatch(validateRegisteredFields(EDIT_DEVICE)());
        if (result.valid) {
            const state = getState();
            const formData = getFormData(EDIT_DEVICE)(state);

            return updateDeviceApi(
                {
                    body: { formData: { [EDIT_DEVICE]: formData } },
                    token: getToken(state),
                    onSuccess: () => {
                        dispatch(update({ ...formData, _id: id }));
                        dispatch(dehydrateState());
                    },
                    id,
                },
                dispatch
            );
        }
    };
}

export function deleteDevice(id) {
    return async function (dispatch, getState) {
        baseLogger('DELETE_DEVICE');
        return deleteDeviceApi(
            {
                token: getToken(getState()),
                id,
                onSuccess: () => {
                    dispatch(remove(id));
                },
            },
            dispatch
        );
    };
}

export function fetch() {
    return function (dispatch, getState) {
        baseLogger('FETCH_DEVICES');
        return fetchDevicesApi(
            {
                token: getToken(getState()),
                onSuccess: (json) => {
                    dispatch(set(json.docs.sort(sortDevices)));
                    dispatch(dehydrateState());
                },
            },
            dispatch
        );
    };
}

export function updateState(deviceId, thingId, state) {
    return async function (dispatch, getState) {
        const EDIT_CONTROL = 'UPDATE_STATE_DEVICE';
        baseLogger(EDIT_CONTROL);
        return updateStateThingApi(
            {
                token: getToken(getState()),
                deviceId,
                thingId,
                body: { state },
                onSuccess: () => {
                    dispatch(
                        updateThing({
                            _id: deviceId,
                            thing: {
                                nodeId: thingId,
                                state: {
                                    value: state,
                                    // timestamp: new Date(),
                                },
                            },
                        })
                    );
                },
            },
            dispatch
        );
    };
}

export function prefillNotify(id, nodeId) {
    return async function (dispatch, getState) {
        return getNotifyApi(
            {
                token: getToken(getState()),
                id,
                nodeId,
                onSuccess: (json) => {
                    const formData = transformNotifyForFE(json.doc.thing.properties);
                    dispatch(fillForm('EDIT_NOTIFY')(formData));
                },
            },
            dispatch
        );
    };
}

export function updateNotify(id, nodeId) {
    return async function (dispatch, getState) {
        const EDIT_NOTIFY = 'EDIT_NOTIFY';
        baseLogger(EDIT_NOTIFY);
        const result = dispatch(validateForm(EDIT_NOTIFY)());
        const formData = getFormData(EDIT_NOTIFY)(getState());
        if (result.valid) {
            return updateNotifyApi(
                {
                    token: getToken(getState()),
                    id,
                    nodeId,
                    body: { formData: { [EDIT_NOTIFY]: formData } },
                    onSuccess: (json) => {
                        // const formData = transformNotifyForFE(json.doc.thing.properties);
                        // dispatch(fillForm("EDIT_NOTIFY")(formData));
                    },
                },
                dispatch
            );
        }
    };
}

export function sendCommand(deviceId) {
    return async function (dispatch, getState) {
        const DEVICE_SEND = 'DEVICE_SEND';
        baseLogger(DEVICE_SEND);
        const result = dispatch(validateForm(DEVICE_SEND)());
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
}
