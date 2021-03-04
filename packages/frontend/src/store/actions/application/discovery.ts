import { baseLogger } from "framework-ui/lib/logger";
import { dehydrateState } from "framework-ui/lib/redux/actions";
import { getFormData, getToken } from "framework-ui/lib/utils/getters";
import { ActionTypes } from "../../../constants/redux";
import { fetchDiscovery, deleteDiscovery, addDiscoveredDevice } from "../../../api/discovery";
import { validateForm } from "framework-ui/lib/redux/actions/formsData";
import { add as addDeviceToState } from "./devices";

import type { DeviceDiscovery } from "common/lib/models/deviceDiscovery";
import type { Device } from "common/lib/models/device";

export function set(data: DeviceDiscovery[]) {
	return {
		type: ActionTypes.SET_DISCOVERED_DEVICES,
		payload: data,
	};
}

export function remove(deviceId: string) {
	return {
		type: ActionTypes.REMOVE_DISCOVERED_DEVICE,
		payload: deviceId,
	};
}

export function fetch() {
	return function (dispatch: any, getState: any) {
		baseLogger("FETCH_DISCOVERED_DEVICES");
		return fetchDiscovery(
			{
				token: getToken(getState()),
				onSuccess: (json: { docs: DeviceDiscovery[] }) => {
					dispatch(set(json.docs));
				},
			},
			dispatch
		);
	};
}

export function deleteDevices() {
	return function (dispatch: any, getState: any) {
		baseLogger("DELETE_DISCOVERED_DEVICES");

		const DISCOVERY_DEVICES = "DISCOVERY_DEVICES";
		const result = dispatch(validateForm(DISCOVERY_DEVICES)());
		if (result.valid) {
			const formData = getFormData(DISCOVERY_DEVICES)(getState()) as any;
			return deleteDiscovery(
				{
					token: getToken(getState()),
					body: { formData: { [DISCOVERY_DEVICES]: formData } },
					onSuccess: () => {
						formData.selected.forEach((deviceId: string) => dispatch(remove(deviceId)));
					},
				},
				dispatch
			);
		}
	};
}

export function addDevice() {
	return function (dispatch: any, getState: any) {
		baseLogger("CREATE_DEVICE");

		const CREATE_DEVICE = "CREATE_DEVICE";
		const result = dispatch(validateForm(CREATE_DEVICE)());
		if (result.valid) {
			const formData = getFormData(CREATE_DEVICE)(getState()) as any;
			return addDiscoveredDevice(
				{
					token: getToken(getState()),
					body: { formData: { [CREATE_DEVICE]: formData } },
					onSuccess: (json: { doc: Device }) => {
						dispatch(remove(formData.info.deviceId));
						dispatch(addDeviceToState(json.doc));
					},
				},
				dispatch
			);
		}
	};
}
