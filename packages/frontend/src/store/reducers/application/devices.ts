import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDevice } from 'common/lib/models/interface/device';
import { IAccessToken } from 'common/lib/models/interface/userInterface';
import { SocketUpdateThingState } from 'common/lib/types';
import { append, curry, filter, lensProp, map, mergeDeepLeft, over, pathEq, propEq, when } from 'ramda';
import { compose } from 'redux';

// Define a type for the slice state
export interface DeviceState {
    data: IDevice[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

// Define the initial state using that type
const initialState: DeviceState = {
    data: [],
};

const alter = curry((action, key, path, items) => map(when(pathEq(path, key), action), items));
const updateThingF = compose(over(lensProp('things')), alter);

export const devicesSlice = createSlice({
    name: 'devices',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        add: (state, action: PayloadAction<IDevice>) => {
            const data = append(action.payload, state.data);
            return { data, lastFetch: state.lastFetch, lastUpdate: new Date() };
        },
        set: (state, action: PayloadAction<IDevice[]>) => {
            const date = new Date();
            return { data: action.payload, lastFetch: date, lastUpdate: date };
        },
        toDefault: () => {
            return initialState;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        remove: ({ data, lastFetch }, action: PayloadAction<IDevice['_id']>) => {
            const deviceID = action.payload;
            return {
                data: filter(({ _id }) => _id !== deviceID, data),
                lastFetch,
                lastUpdate: new Date(),
            };
        },
        update: ({ data, lastFetch }, action: PayloadAction<IAccessToken>) => {
            // @ts-ignore
            const findAndUpdate: any = when(propEq('_id', action.payload._id), mergeDeepLeft(action.payload));
            return {
                data: map(findAndUpdate, data),
                lastFetch,
                lastUpdate: new Date(),
            };
        },
        updateThing: ({ data, lastFetch }, action: PayloadAction<SocketUpdateThingState>) => {
            const {
                _id,
                thing: { nodeId, ...updateData },
            } = action.payload;

            const newData = alter(
                updateThingF(mergeDeepLeft(updateData), nodeId, ['config', 'nodeId']),
                _id,
                ['_id'],
                data
            );
            return { lastFetch, data: newData, lastUpdate: new Date() };
        },
    },
});

export const devicesReducerActions = devicesSlice.actions;

export default devicesSlice.reducer;
