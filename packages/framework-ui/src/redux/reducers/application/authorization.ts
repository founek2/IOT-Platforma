import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthorizationState {
    loggedIn: boolean;
    accessToken: string;
    tokenExpiryDate: string;
}

const initialState: AuthorizationState = {
    loggedIn: false,
    accessToken: '',
    tokenExpiryDate: '',
};

export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setTokenExpiryDate: (state, action: PayloadAction<number>) => {
            const date = new Date();
            date.setSeconds(date.getSeconds() + action.payload);
            state.tokenExpiryDate = date.toISOString();
        },
    },
});

export const authorizationReducerActions = authorizationSlice.actions;

export default authorizationSlice.reducer;
