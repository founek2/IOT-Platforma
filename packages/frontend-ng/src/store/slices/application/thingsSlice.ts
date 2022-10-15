import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IThing } from 'common/src/models/interface/thing';
import { devicesApi } from '../../../services/devices';
import { normalizeDevices } from '../../../utils/normalizr';

export type Thing = Omit<IThing, '_id'> & { _id: string };

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
    extraReducers: (builder) => {
        builder.addCase('store/reset', (state) => thingsAdapter.getInitialState());
        builder.addMatcher(devicesApi.endpoints.devices.matchFulfilled, (state, { payload }) => {
            const normalized = normalizeDevices(payload.docs);

            thingsAdapter.setAll(state, normalized.entities.things as any);
        });
    },
});

export const thingsReducerActions = thingsSlice.actions;
export const thingSelectors = thingsAdapter.getSelectors();

export default thingsSlice.reducer;
