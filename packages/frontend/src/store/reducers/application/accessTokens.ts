import { IDevice } from 'common/lib/models/interface/device';
import { SocketUpdateThingState } from 'common/lib/types';
import { IState } from 'frontend/src/types';
import { append, curry, filter, lensProp, map, mergeDeepLeft, over, pathEq, propEq, when } from 'ramda';
import { compose } from 'redux';
import { Action, handleActions } from 'redux-actions';
import { ActionTypes } from '../../../constants/redux';
import { IAccessToken } from 'common/lib/models/interface/userInterface';

type State = IState['application']['devices'];

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
    next({ data, lastFetch, lastUpdate }: State, action: Action<IAccessToken['_id']>): State {
        const deviceID = action.payload;
        return { data: filter(({ _id }) => _id !== deviceID, data), lastFetch, lastUpdate };
    },
};

const update = {
    next({ data, lastFetch }: State, action: Action<Partial<IDevice>>): State {
        const { _id, ...updateData } = action.payload;
        // @ts-ignore
        const findAndUpdate: any = when(propEq('_id', _id), mergeDeepLeft(action.payload));
        return {
            data: map(findAndUpdate, data),
            lastFetch,
            lastUpdate: new Date(),
        };
    },
};

const deviceReducers = {
    [ActionTypes.ADD_ACCESS_TOKEN]: add,
    [ActionTypes.SET_ACCESS_TOKENS]: set,
    [ActionTypes.REMOVE_ACCESS_TOKEN]: remove,
    [ActionTypes.UPDATE_ACCESS_TOKENS]: update,
};

export default handleActions<State>(deviceReducers as any, { data: [] });
