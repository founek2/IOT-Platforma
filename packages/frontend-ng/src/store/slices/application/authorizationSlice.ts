import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from 'common/src/models/interface/userInterface';
import { signInApi } from '../../../services/signIn';

export interface AuthorizationState {
    loggedIn: boolean;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    currentUser: IUser | null;
}

const initialState: AuthorizationState = {
    loggedIn: false,
    accessToken: '',
    accessTokenExpiresAt: '',
    refreshToken: '',
    refreshTokenExpiresAt: '',
    currentUser: null,
};

export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<IUser>) => {
            state.loggedIn = action.payload ? true : false;
            state.currentUser = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<{ token: string; expiresAt: string }>) => {
            state.accessToken = action.payload.token;
            state.accessTokenExpiresAt = action.payload.expiresAt;
        },
        setRefreshToken: (state, action: PayloadAction<{ token: string; expiresAt: string }>) => {
            state.refreshToken = action.payload.token;
            state.refreshTokenExpiresAt = action.payload.expiresAt;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', (state) => initialState);
        builder.addMatcher(signInApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
            state.loggedIn = true;
            state.accessToken = payload.accessToken || payload.token;
            state.currentUser = payload.user;
        });
        builder.addMatcher(signInApi.endpoints.signInOauth.matchFulfilled, (state, { payload }) => {
            state.loggedIn = true;
            state.accessToken = payload.accessToken || payload.token;
            state.currentUser = payload.user;
        });
    },
});

export const authorizationReducerActions = authorizationSlice.actions;

export default authorizationSlice.reducer;
