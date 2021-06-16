import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'ramda';

// Define a type for the slice state
export interface HistoryState {
    pathname: string;
    hash: string;
    search: string;
    query: { [key: string]: string | undefined };
}

// Define the initial state using that type
const initialState: HistoryState = {
    pathname: '',
    hash: '',
    search: '',
    query: {},
};

export const historySlice = createSlice({
    name: 'history',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<HistoryState>) => {
            console.log('set', state, action.payload);
            return action.payload;
        },
        update: (state, action: PayloadAction<Partial<HistoryState>>) => {
            console.log('update', state, action.payload);
            return merge(state, action.payload);
        },
    },
});

export const historyReducerActions = historySlice.actions;

export default historySlice.reducer;
