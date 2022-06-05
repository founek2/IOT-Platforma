import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IThing } from 'common/src/models/interface/thing';

export type Thing = IThing;

const thingsAdapter = createEntityAdapter<Thing>({
    selectId: (thing) => thing._id,
    sortComparer: (a, b) => a.config.name.localeCompare(b.config.name),
});

export const thingsSlice = createSlice({
    name: 'things',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: thingsAdapter.getInitialState(),
    reducers: {
        addOne: thingsAdapter.addOne,
        addMany: thingsAdapter.addMany,
        setAll: thingsAdapter.setAll,
        toDefault: () => {
            return thingsAdapter.getInitialState();
        },
        removeOne: thingsAdapter.removeOne,
        updateOne: thingsAdapter.updateOne,
    },
});

export const thingsReducerActions = thingsSlice.actions;
export const thingSelectors = thingsAdapter.getSelectors();

export default thingsSlice.reducer;
