import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IThing } from 'common/lib/models/interface/thing';
import { mergeDeepLeft } from 'ramda';

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
        updateOneState: function (state, action: PayloadAction<{ id: string; changes: Thing['state'] }>) {
            const {
                payload: { changes, id },
            } = action;

            const thing = state.entities[id];
            if (thing && changes) {
                if (!thing.state) {
                    thing.state = { value: {} } as any;
                }
                thing.state!.timestamp = changes.timestamp;
                Object.keys(changes.value).forEach((propertyId) => {
                    const value = changes.value[propertyId];
                    thing.state!.value[propertyId] = value;
                });
            }
        },
    },
});

export const thingsReducerActions = thingsSlice.actions;
export const thingSelectors = thingsAdapter.getSelectors();

export default thingsSlice.reducer;
