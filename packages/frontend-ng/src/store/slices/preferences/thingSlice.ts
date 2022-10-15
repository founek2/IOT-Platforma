import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export type ThingPreferences = { _id: string; order: number };
// Define a type for the slice state

const thingPreferencesAdapter = createEntityAdapter<ThingPreferences>({
    // Assume IDs are stored in a field other than `book.id`
    selectId: (thing) => thing._id,
});

export const thingPreferencesSlice = createSlice({
    name: 'thing',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: thingPreferencesAdapter.getInitialState(),
    reducers: {
        addOne: thingPreferencesAdapter.addOne,
        addMany: thingPreferencesAdapter.addMany,
        setOne: thingPreferencesAdapter.setOne,
        setAll: thingPreferencesAdapter.setAll,
        removeOne: thingPreferencesAdapter.removeOne,
        updateOne: thingPreferencesAdapter.updateOne,
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', (state) => thingPreferencesAdapter.getInitialState());
        // builder.addMatcher(devicesApi.endpoints.devices.matchFulfilled, (state, { payload }) => {
        //     const normalized = normalizeDevices(payload.docs);

        //     devicesAdapter.setAll(state, normalized.entities.devices as any);
        // });
    },
});

export const thingPreferencesReducerActions = thingPreferencesSlice.actions;
export const thingPreferencesSelectors = thingPreferencesAdapter.getSelectors();

export default thingPreferencesSlice.reducer;
