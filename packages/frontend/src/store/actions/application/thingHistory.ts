import type { IDevice } from "common/lib/models/interface/device";
import type { IDiscovery } from "common/lib/models/interface/discovery";
import type { IThing } from "common/lib/models/interface/thing";
import { subDays } from "date-fns";
import { baseLogger } from "framework-ui/lib/logger";
import { getToken } from "framework-ui/lib/utils/getters";
import { fetchHistory as fetchHistoryApi } from "../../../api/thingApi";
import { ActionTypes } from "../../../constants/redux";


export function set(data: any) {
    return {
        type: ActionTypes.SET_THING_HISTORY,
        payload: data,
    };
}

export function fetchHistory(deviceId: IDevice["_id"], thingId: IThing["_id"]) {
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
                onSuccess: (json: { docs: IDiscovery[] }) => {
                    dispatch(set({ data: json.docs, deviceId, thingId }));
                },
            },
            dispatch
        );
    };
}
