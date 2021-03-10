import { handleActions } from "redux-actions";
import {
	assoc,
	append,
	mergeDeepRight,
	findIndex,
	propEq,
	filter,
	clone,
	curry,
	map,
	when,
	mergeDeepLeft,
	tap,
	o,
	prop,
	over,
	lensProp,
} from "ramda";
import { ActionTypes } from "../../../constants/redux";
import { compose } from "redux";

const add = {
	next(state, action) {
		const data = append(action.payload, state.data);
		return assoc("data", data, state);
	},
};

const set = {
	next(state, action) {
		const date = new Date();
		return { data: action.payload, lastFetch: date, lastUpdate: date };
	},
};

const remove = {
	next({ data, lastFetch, lastUpdate }, action) {
		const deviceID = action.payload;
		return { data: filter(({ _id }) => _id !== deviceID, data), lastFetch, lastUpdate };
	},
};

const update = {
	next({ data, lastFetch, lastUpdate }, action) {
		const { _id, ...updateData } = action.payload;
		return {
			data: map(when(propEq("_id", _id), mergeDeepLeft(updateData)), data),
			lastFetch,
			lastUpdate,
		};
	},
};

const alter = curry((action, key, items) => map(when(propEq("_id", key), action), items));
const updateThingF = compose(over(lensProp("things")), alter);

const updateThing = {
	next({ data, lastFetch, lastUpdate }, action) {
		const {
			_id,
			thing: { _id: thingId, ...updateData },
		} = action.payload;

		const newData = alter(updateThingF(mergeDeepLeft(updateData), thingId), _id, data);
		return { lastFetch, data: newData, lastUpdate: new Date() };
	},
};

const updateAll = {
	next({ lastFetch, data }, action) {
		const updateData = action.payload;
		const newData = clone(data);
		updateData.forEach(({ id: updateId, control, ack }) => {
			const i = data.findIndex(({ id }) => updateId === id);

			if (i >= 0) {
				newData[i].control = control;
				newData[i].ack = ack;
			}
		});

		return { lastFetch, data: newData, lastUpdate: new Date() };
	},
};

const deviceReducers = {
	[ActionTypes.ADD_DEVICE]: add,
	[ActionTypes.SET_DEVICES]: set,
	[ActionTypes.REMOVE_DEVICE]: remove,
	[ActionTypes.UPDATE_DEVICE]: update,
	[ActionTypes.UPDATE_DEVICES]: updateAll,
	[ActionTypes.UPDATE_THING]: updateThing,
};

export default handleActions(deviceReducers, {});
