import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IThing } from 'common/src/models/interface/thing';
import { devicesApi } from '../../../endpoints/devices';
import { thingsApi } from '../../../endpoints/thing';
import { normalizeDevices } from '../../../utils/normalizr';

export interface PropertyState {
    value: string | number | boolean;
    timestamp: string;
}

export type Thing = Omit<IThing, '_id' | 'state'> & {
    _id: string;
    deviceId: string;
    state?: Record<string, PropertyState | undefined>;
};

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
                    thing.state = {};
                }
                thing.state!.timestamp = changes.timestamp;
                Object.keys(changes).forEach((propertyId) => {
                    thing.state![propertyId] = changes[propertyId];
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', () => thingsAdapter.getInitialState());
        builder.addMatcher(devicesApi.endpoints.devices.matchFulfilled, (state, { payload }) => {
            const normalized = normalizeDevices(payload.docs);

            thingsAdapter.setAll(state, normalized.entities.things as any);
        });
        builder.addMatcher(thingsApi.endpoints.updateThingState.matchPending, (state, { payload, meta }) => {
            const { thingId, value, propertyId } = meta.arg.originalArgs;

            thingsSlice.caseReducers.updateOneState(state, {
                payload: { id: thingId, changes: { [propertyId]: { value, timestamp: new Date().toString() } } },
                type: 'things/updateOneState',
            });
        });
    },
});

export const thingsReducerActions = thingsSlice.actions;
export const thingSelectors = thingsAdapter.getSelectors();

export default thingsSlice.reducer;
