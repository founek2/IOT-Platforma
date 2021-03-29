import { append, assoc, contains, equals, filter, includes, not, o, path, prop, propEq } from "ramda";
import { compose } from "redux";
import { handleActions, ActionMeta, Action } from "redux-actions";
import { ActionTypes } from "../../../constants/redux";

import { IDiscovery } from "common/lib/models/interface/discovery";

export interface State {
    data: (IDiscovery & { _id: string })[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

const set = {
    next(state: State, action: Action<IDiscovery[]>) {
        const date = new Date();
        return { data: action.payload, lastFetch: date, lastUpdate: date };
    },
};

const add = {
    next(state: State, action: Action<IDiscovery & { _id: string }>) {

        return { data: append(action.payload, filter(o(not, propEq("_id", action.payload._id)), state.data)), lastFetch: state.lastFetch, lastUpdate: new Date() };
    },
};

const remove = {
    next(state: State, action: Action<IDiscovery["_id"]>) {
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

export default handleActions(deviceReducers as any, { data: [] });
