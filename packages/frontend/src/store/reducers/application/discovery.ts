import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDiscovery } from 'common/src/models/interface/discovery';
import { append, equals, filter, not, o, prop, propEq } from 'ramda';
import { compose } from 'redux';

export type Discovery = IDiscovery & { _id: string };
// Define a type for the slice state
export interface DiscoveryState {
    data: Discovery[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

// Define the initial state using that type
const initialState: DiscoveryState = {
    data: [],
};

export const discoverySlice = createSlice({
    name: 'discovery',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Discovery>) => {
            const filtered = state.data.filter((device) => device._id !== action.payload._id);

            return {
                data: append(action.payload, filtered),
                lastFetch: state.lastFetch,
                lastUpdate: new Date(),
            };
        },
        toDefault: () => {
            return initialState;
        },
        set: (state, action: PayloadAction<Discovery[]>) => {
            const date = new Date();
            return { data: action.payload, lastFetch: date, lastUpdate: date };
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        remove: ({ data, lastFetch }, action: PayloadAction<IDiscovery['_id']>) => {
            const newData = filter(compose(not, equals(action.payload), prop('_id')), data);
            return { data: newData, lastFetch: lastFetch, lastUpdate: new Date() };
        },
    },
});

export const discoveryReducerActions = discoverySlice.actions;

export default discoverySlice.reducer;
