import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInApi, User } from '../../../endpoints/signIn.js';
import { usersApi } from '../../../endpoints/users.js';

export interface AuthorizationState {
    loggedIn: boolean;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    currentUser: User | null;
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
        setCurrentUser: (state, action: PayloadAction<User>) => {
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
        builder.addMatcher(usersApi.endpoints.registerAndSignIn.matchFulfilled, (state, { payload }) => {
            state.loggedIn = true;
            state.accessToken = payload.accessToken || payload.token;
            state.currentUser = payload.user;
        });
        builder.addMatcher(usersApi.endpoints.users.matchFulfilled, (state, { payload }) => {
            const currentUser = payload.find((user: User) => user._id === state.currentUser?._id)
            if (currentUser) {
                state.currentUser = currentUser
            }
        });
    },
});

export const authorizationReducerActions = authorizationSlice.actions;

export default authorizationSlice.reducer;
