import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'ramda';

// Define a type for the slice state
export type User = { _id?: any };
export type UserState = User | null;

// Define the initial state using that type
const initialState = null as UserState;

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<User>) => {
            return action.payload;
        },
        update: (state, action: PayloadAction<User>) => {
            if (!state) return action.payload;

            return merge(state, action.payload);
        },
        toDefault: () => {
            return initialState;
        },
    },
});

export const userReducerActions = userSlice.actions;

export default userSlice.reducer;
