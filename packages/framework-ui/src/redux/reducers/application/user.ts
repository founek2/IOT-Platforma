import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { merge } from 'ramda';

// Define a type for the slice state
export type UserState = { _id?: any; loggedIn: boolean };

// Define the initial state using that type
const initialState: UserState = { loggedIn: false };

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<UserState>) => {
            return action.payload;
        },
        update: (state, action: PayloadAction<UserState>) => {
            return merge(state, action.payload);
        },
        remove: (state, action: Action) => {
            return { loggedIn: false };
        },
        toDefault: () => {
            return initialState;
        },
    },
});

export const userReducerActions = userSlice.actions;

export default userSlice.reducer;
