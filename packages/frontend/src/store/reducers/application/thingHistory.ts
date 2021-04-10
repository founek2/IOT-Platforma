import { HistoricalSensor } from "common/lib/models/interface/history";
import { handleActions } from "redux-actions";
import { ActionTypes } from "../../../constants/redux";


export interface state {
    data: HistoricalSensor[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

const set = {
    next(state: state, action: any) {
        const date = new Date();
        return {
            data: action.payload.data,
            deviceId: action.payload.deviceId,
            thingId: action.payload.thingId,
            lastFetch: date,
            lastUpdate: date,
        };
    },
};

const deviceReducers = {
    [ActionTypes.SET_THING_HISTORY]: set,
};

export default handleActions(deviceReducers, { data: [] });
