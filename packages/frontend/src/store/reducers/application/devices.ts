import { IDevice } from "common/lib/models/interface/device";
import { SocketUpdateThingState } from "common/lib/types";
import { IState } from "frontend/src/types";
import { append, curry, filter, lensProp, map, mergeDeepLeft, over, pathEq, propEq, when } from "ramda";
import { compose } from "redux";
import { Action, handleActions } from "redux-actions";
import { ActionTypes } from "../../../constants/redux";

type State = IState["application"]["devices"];

const add = {
    next(state: State, action: Action<IDevice>): State {
        const data = append(action.payload, state.data);
        return { data, lastFetch: state.lastFetch, lastUpdate: new Date() };
    },
};

const set = {
    next(state: State, action: Action<IDevice[]>): State {
        const date = new Date();
        return { data: action.payload, lastFetch: date, lastUpdate: date };
    },
};

const remove = {
    next({ data, lastFetch, lastUpdate }: State, action: Action<IDevice["_id"]>): State {
        const deviceID = action.payload;
        return { data: filter(({ _id }) => _id !== deviceID, data), lastFetch, lastUpdate };
    },
};

const update = {
    next({ data, lastFetch, lastUpdate }: State, action: Action<Partial<IDevice>>): State {
        const { _id, ...updateData } = action.payload;
        // @ts-ignore
        const findAndUpdate: any = when(propEq("_id", _id), mergeDeepLeft(action.payload));
        return {
            data: map(findAndUpdate, data),
            lastFetch,
            lastUpdate,
        };
    },
};

const alter = curry((action, key, path, items) => map(when(pathEq(path, key), action), items));
const updateThingF = compose(over(lensProp("things")), alter);

const updateThing = {
    next({ data, lastFetch, lastUpdate }: State, action: Action<SocketUpdateThingState>): State {
        const {
            _id,
            thing: { nodeId, ...updateData },
        } = action.payload;
        console.log("updating", action.payload);
        const newData = alter(
            updateThingF(mergeDeepLeft(updateData), nodeId, ["config", "nodeId"]),
            _id,
            ["_id"],
            data
        );
        return { lastFetch, data: newData, lastUpdate: new Date() };
    },
};

const deviceReducers = {
    [ActionTypes.ADD_DEVICE]: add,
    [ActionTypes.SET_DEVICES]: set,
    [ActionTypes.REMOVE_DEVICE]: remove,
    [ActionTypes.UPDATE_DEVICE]: update,
    [ActionTypes.UPDATE_THING]: updateThing,
};

export default handleActions<State>(deviceReducers as any, { data: [] });
