import { append, assoc, contains, equals, filter, includes, not, o, path, prop } from "ramda";
import { compose } from "redux";
import { handleActions } from "redux-actions";
import { ActionTypes } from "../../../constants/redux";

import type { DeviceDiscovery } from "common/lib/models/deviceDiscoveryModel";

export interface state {
	data: DeviceDiscovery[];
	lastFetch?: Date;
	lastUpdate?: Date;
}

const set = {
	next(state: state, action: any) {
		const date = new Date();
		return { data: action.payload, lastFetch: date, lastUpdate: date };
	},
};

const add = {
	next(state: state, action: any) {
		return { data: append(action.payload, action.payload), lastFetch: state.lastFetch, lastUpdate: new Date() };
	},
};

const remove = {
	next(state: state, action: any) {
		console.log("removing", action);
		const newData = filter(compose(not, equals(action.payload), prop("_id")), state.data);
		return { data: newData, lastFetch: state.lastFetch, lastUpdate: new Date() };
	},
};

const deviceReducers = {
	[ActionTypes.SET_DISCOVERED_DEVICES]: set,
	[ActionTypes.REMOVE_DISCOVERED_DEVICE]: remove,
	[ActionTypes.ADD_DISCOVERED_DEVICES]: add,
};

export default handleActions(deviceReducers, { data: [] });
