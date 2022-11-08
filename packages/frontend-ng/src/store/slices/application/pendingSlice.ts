import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { thingsApi } from '../../../endpoints/thing';

export type Change = { timestamp: number; thingId: string; propertyId: string; value: string | number };

const pendingAdapter = createEntityAdapter<Change>({
    // Assume IDs are stored in a field other than `book.id`
    selectId: (change) => change.timestamp,
});

export const pendingSlice = createSlice({
    name: 'pending',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: pendingAdapter.getInitialState(),
    reducers: {
        addOne: pendingAdapter.addOne,
        addMany: pendingAdapter.addMany,
        setOne: pendingAdapter.setOne,
        setAll: pendingAdapter.setAll,
        removeOne: pendingAdapter.removeOne,
        updateOne: pendingAdapter.updateOne,
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', () => pendingAdapter.getInitialState());
        builder.addMatcher(thingsApi.endpoints.updateThingState.matchPending, (state, { payload, meta }) => {
            const { thingId, value, propertyId } = meta.arg.originalArgs;

            pendingAdapter.addOne(state, {
                payload: {
                    timestamp: Date.now(),
                    thingId,
                    propertyId,
                    value,
                },
                type: 'pending/addOne',
            });
        });
    },
});

export const pendingReducerActions = pendingSlice.actions;
export const pedningSelectors = pendingAdapter.getSelectors();

export default pendingSlice.reducer;
