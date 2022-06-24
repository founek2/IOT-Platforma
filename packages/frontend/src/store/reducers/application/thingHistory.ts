import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDevice } from 'common/src/models/interface/device';
import { IThing } from 'common/src/models/interface/thing';
import { Measurement } from 'common/src/types';

// Define a type for the slice state
export interface ThingHistoryState {
    data: Measurement[];
    lastFetch?: Date;
    lastUpdate?: Date;
    deviceId?: IDevice['_id'];
    thingId?: IThing['config']['nodeId'];
}

// Define the initial state using that type
const initialState: ThingHistoryState = {
    data: [],
};

export const thingHistorySlice = createSlice({
    name: 'thingHistory',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (
            state,
            action: PayloadAction<{
                data: Measurement[];
                deviceId: IDevice['_id'];
                thingId: IThing['config']['nodeId'];
            }>
        ) => {
            const date = new Date();
            return {
                data: action.payload.data,
                deviceId: action.payload.deviceId,
                thingId: action.payload.thingId,
                lastFetch: date,
                lastUpdate: date,
            };
        },
        toDefault: () => {
            return initialState;
        },
    },
});

export const thingHistoryReducerActions = thingHistorySlice.actions;

export default thingHistorySlice.reducer;
