import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInApi, User } from '../../../endpoints/signIn';
import { usersApi } from '../../../endpoints/users';
import parseJwt from "common/src/utils/parseJwtToken"

export interface AuthorizationState {
    loggedIn: boolean;
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    refreshTokenExpiresAt: number;
    currentUser: User | null;
}

const initialState: AuthorizationState = {
    loggedIn: false,
    accessToken: '',
    accessTokenExpiresAt: 0,
    refreshToken: '',
    refreshTokenExpiresAt: 0,
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
        setAccessToken: (state, action: PayloadAction<{ token: string; expiresAt: number }>) => {
            state.accessToken = action.payload.token;
            state.accessTokenExpiresAt = action.payload.expiresAt;
        },
        setRefreshToken: (state, action: PayloadAction<{ token: string; expiresAt: number }>) => {
            state.refreshToken = action.payload.token;
            state.refreshTokenExpiresAt = action.payload.expiresAt;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', (state) => initialState);
        builder.addMatcher(signInApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
            const tokenPayload = parseJwt(payload.accessToken)

            state.loggedIn = true;
            state.refreshToken = payload.refreshToken;
            state.accessToken = payload.accessToken;
            state.accessTokenExpiresAt = tokenPayload.exp;
            state.currentUser = payload.user;
        });
        builder.addMatcher(signInApi.endpoints.signInRefresh.matchFulfilled, (state, { payload }) => {
            const tokenPayload = parseJwt(payload.accessToken)

            state.accessToken = payload.accessToken;
            state.accessTokenExpiresAt = tokenPayload.exp;
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
            const currentUser = payload.find(user => user._id === state.currentUser?._id)
            if (currentUser) {
                state.currentUser = currentUser
            }
        });
    },
});

export const authorizationReducerActions = authorizationSlice.actions;

export default authorizationSlice.reducer;
