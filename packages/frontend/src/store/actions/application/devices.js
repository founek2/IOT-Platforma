import { ActionTypes } from "../../../constants/redux";
import { getFormData, getToken } from "framework-ui/lib/utils/getters";
import { resetForm, validateRegisteredFields, fillForm } from "framework-ui/lib/redux/actions/formsData";
import { updateTmpData } from "framework-ui/lib/redux/actions/tmpData";
import { baseLogger, errorLog } from "framework-ui/lib/logger";
import loadFilesInFormData from "framework-ui/lib/utils/loadFilesInFormData";
import { dehydrateState } from "framework-ui/lib/redux/actions";
import {
	createDevice as createDeviceApi,
	fetchDevices as fetchDevicesApi,
	fetchDeviceSensors as fetchDeviceSensorsApi,
	fetchDeviceControl as fetchDeviceControlApi,
	putDevice as putDeviceApi,
	deleteDevice as deleteDeviceApi,
	deleteDevices as deleteDevicesApi,
	fetchDeviceData as fetchDeviceDataApi,
	getNotify as getNotifyApi,
} from "../../../api/deviceApi";
import { transformSensorsForBE, transformControlForBE, transformNotifyForFE } from "common/lib/utils/transform";
import io from "../../../webSocket";
import { addNotification } from "framework-ui/lib/redux/actions/application/notifications";

export function createDevice() {
	return async function (dispatch, getState) {
		const CREATE_SENSOR = "CREATE_DEVICE";
		baseLogger(CREATE_SENSOR);
		const result = dispatch(validateRegisteredFields(CREATE_SENSOR)());
		if (result.valid) {
			const state = getState();
			const formData = getFormData(CREATE_SENSOR)(state);
			const newFormDataWithFiles = await loadFilesInFormData(formData); //
			return createDeviceApi(
				{
					body: { formData: { [CREATE_SENSOR]: newFormDataWithFiles } },
					token: getToken(state),
					onSuccess: (json) => {
						dispatch(resetForm(CREATE_SENSOR)());
						dispatch(updateTmpData({ dialog: { apiKey: json.apiKey } }));
						dispatch(add(json.doc));
						dispatch(dehydrateState());
					},
				},
				dispatch
			);
		}
	};
}

export function updateDevice(id) {
	return async function (dispatch, getState) {
		const EDIT_DEVICE = "EDIT_DEVICE";
		baseLogger(EDIT_DEVICE);
		const result = dispatch(validateRegisteredFields(EDIT_DEVICE)());
		if (result.valid) {
			const state = getState();
			const formData = getFormData(EDIT_DEVICE)(state);
			const newFormDataWithFiles = await loadFilesInFormData(formData);

			return putDeviceApi(
				{
					body: { formData: { [EDIT_DEVICE]: newFormDataWithFiles } },
					token: getToken(state),
					onSuccess: () => {
						// TODO force refresh new image - maybe add timestamp as query to disable cache
						delete formData.image;
						dispatch(update({ ...formData, id }));
						dispatch(dehydrateState());
					},
					id,
				},
				dispatch
			);
		}
	};
}

export function updatePermissions(id) {
	return async function (dispatch, getState) {
		const EDIT_PERMISSIONS = "EDIT_PERMISSIONS";
		baseLogger(EDIT_PERMISSIONS);
		const result = dispatch(validateRegisteredFields(EDIT_PERMISSIONS)());
		if (result.valid) {
			const state = getState();
			const formData = getFormData(EDIT_PERMISSIONS)(state);

			return putDeviceApi(
				{
					body: { formData: { [EDIT_PERMISSIONS]: formData } },
					token: getToken(state),
					id,
					onSuccess: () => {
						dispatch(update({ id, permissions: formData }));
					},
				},
				dispatch
			);
		}
	};
}

export function deleteDevice(id) {
	return async function (dispatch, getState) {
		baseLogger("DELETE_DEVICE");
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

export function deleteDevices() {
	return async function (dispatch, getState) {
		const DEVICE_MANAGEMENT = "DEVICE_MANAGEMENT";
		baseLogger(DEVICE_MANAGEMENT);
		const result = dispatch(validateRegisteredFields(DEVICE_MANAGEMENT)());
		if (result.valid) {
			const state = getState();
			const formData = getFormData(DEVICE_MANAGEMENT)(state);
			return deleteDevicesApi(
				{
					token: getToken(getState()),
					body: { formData: { [DEVICE_MANAGEMENT]: formData } },
					onSuccess: () => {
						console.log("going to delete", formData.selected);
						formData.selected.forEach((id) => dispatch(remove(id)));
					},
				},
				dispatch
			);
		}
	};
}

export function update(device) {
	return {
		type: ActionTypes.UPDATE_DEVICE,
		payload: device,
	};
}

export function updateAll(devices) {
	return {
		type: ActionTypes.UPDATE_DEVICES,
		payload: devices,
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

export function fetch() {
	return function (dispatch, getState) {
		baseLogger("FETCH_DEVICES");
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

export function fetchControl() {
	return function (dispatch, getState) {
		baseLogger("FETCH_DEVICES_CONTROL");
		return fetchDeviceControlApi(
			{
				token: getToken(getState()),
				onSuccess: (json) => {
					dispatch(updateAll(json.docs));
					dispatch(dehydrateState());
				},
			},
			dispatch
		);
	};
}

export function fetchSensors() {
	return function (dispatch, getState) {
		baseLogger("FETCH_DEVICES_SENSORS");
		return fetchDeviceSensorsApi(
			{
				token: getToken(getState()),
				onSuccess: (json) => {
					dispatch(updateAll(json.docs));
					dispatch(dehydrateState());
				},
			},
			dispatch
		);
	};
}

export function set(data) {
	return {
		type: ActionTypes.SET_DEVICES,
		payload: data,
	};
}

export function updateSensors(id) {
	return async function (dispatch, getState) {
		const EDIT_SENSORS = "EDIT_SENSORS";
		baseLogger(EDIT_SENSORS);
		const result = dispatch(validateRegisteredFields(EDIT_SENSORS)());
		const formData = getFormData(EDIT_SENSORS)(getState());
		if (result.valid) {
			return putDeviceApi(
				{
					token: getToken(getState()),
					body: { formData: { [EDIT_SENSORS]: formData } },
					id,
					onSuccess: () => {
						const { sampleInterval, sensors } = transformSensorsForBE(formData);
						dispatch(update({ id, sensors: { recipe: sensors, sampleInterval } }));
					},
				},
				dispatch
			);
		}
	};
}

export function updateControl(id) {
	return async function (dispatch, getState) {
		const EDIT_CONTROL = "EDIT_CONTROL";
		baseLogger(EDIT_CONTROL);
		const result = dispatch(validateRegisteredFields(EDIT_CONTROL)());
		const formData = getFormData(EDIT_CONTROL)(getState());
		if (result.valid) {
			return putDeviceApi(
				{
					token: getToken(getState()),
					body: { formData: { [EDIT_CONTROL]: formData } },
					id,
					onSuccess: () => {
						const { control } = transformControlForBE(formData);
						dispatch(update({ id, control: { recipe: control } }));
					},
				},
				dispatch
			);
		}
	};
}

export function updateState(_id, thingId, state) {
	return async function (dispatch, getState) {
		const EDIT_CONTROL = "UPDATE_STATE_DEVICE";
		baseLogger(EDIT_CONTROL);
		io.getSocket().emit("updateState", { _id, thing: { _id: thingId, state } }, function (json) {
			if (json.error) {
				dispatch(addNotification({ message: "Nastala chyba", variant: "error" }));
				errorLog("UpdateState error>", json.error);
			} else {
				dispatch(
					updateThing({
						_id,
						thing: {
							_id: thingId,
							state: {
								value: state,
								// timestamp: new Date(),
							},
						},
					})
				);
			}
		});
	};
}

export function fetchApiKey(id) {
	return async function (dispatch, getState) {
		return fetchDeviceDataApi({
			id,
			token: getToken(getState()),
			params: {
				type: "apiKey",
			},
			onSuccess: (json) => {
				dispatch(updateTmpData({ dialog: { apiKey: json.apiKey } }));
			},
		});
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
					console.log("json", json);
					const formData = transformNotifyForFE(json.doc.things);
					dispatch(fillForm("EDIT_NOTIFY")(formData));
				},
			},
			dispatch
		);
	};
}
