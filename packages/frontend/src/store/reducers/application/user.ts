import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from 'common/src/models/interface/userInterface';
import { mergeDeepRight } from 'ramda';

// Define a type for the slice state
export type User = IUser | null;

// Define the initial state using that type
const initialState = null as User;

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
            if (action.payload === null) return action.payload;

            return mergeDeepRight(state, action.payload) as any;
        },
        toDefault: () => {
            return initialState;
        },
    },
});

export const userReducerActions = userSlice.actions;

export default userSlice.reducer;
