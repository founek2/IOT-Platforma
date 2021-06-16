import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface UserNamesState {
    data: Array<{ _id: string; userName: string }>;
    lastFetch?: Date;
    lastUpdate?: Date;
}

// Define the initial state using that type
const initialState: UserNamesState = {
    data: [],
};

export const userNamesSlice = createSlice({
    name: 'userNames',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<Array<{ _id: string; userName: string }>>) => {
            return { data: action.payload, lastFetch: new Date(), lastUpdate: new Date() };
        },
    },
});

export const userNamesReducerActions = userNamesSlice.actions;

export default userNamesSlice.reducer;
