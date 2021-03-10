import { baseLogger } from "framework-ui/lib/logger";
import { dehydrateState } from "framework-ui/lib/redux/actions";
import { getFormData, getToken } from "framework-ui/lib/utils/getters";
import { ActionTypes } from "../../../constants/redux";
import { fetchHistory as fetchHistoryApi } from "../../../api/thingApi";
import { validateForm } from "framework-ui/lib/redux/actions/formsData";
import { add as addDeviceToState } from "./devices";

import type { DeviceDiscovery } from "common/lib/models/deviceDiscoveryModel";
import type { Device } from "common/lib/models/interface/device";
import { subDays } from "date-fns";
import { IThing } from "common/lib/models/interface/thing";

export function set(data: any) {
	return {
		type: ActionTypes.SET_THING_HISTORY,
		payload: data,
	};
}

export function fetchHistory(deviceId: Device["_id"], thingId: IThing["_id"]) {
	return function (dispatch: any, getState: any) {
		baseLogger("FETCH_DISCOVERED_DEVICES");
		return fetchHistoryApi(
			{
				deviceId,
				thingId,
				token: getToken(getState()),
				params: {
					from: subDays(new Date(), 1).getTime(),
				},
				onSuccess: (json: { docs: DeviceDiscovery[] }) => {
					dispatch(set({ data: json.docs, deviceId, thingId }));
				},
			},
			dispatch
		);
	};
}
