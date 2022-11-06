import { AuthType } from 'common/src/constants';
import { IUser } from 'common/src/models/interface/userInterface';
import { buildRedirectUri } from '../utils/redirectUri';
import { api } from './api';

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    token: string;
    user: IUser;
}

export interface AuthTypesResponse {
    authTypes: AuthType[];
}

export type AuthProvider = {
    provider: string;
    authUrl: string;
    iconUrl: string;
};

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        signIn: build.mutation<SignInResponse, { userName: string; password: string }>({
            query(body) {
                return {
                    url: `auth/user/signIn`,
                    method: 'POST',
                    body: { formData: { LOGIN: { ...body, authType: AuthType.passwd } } },
                };
            },
            invalidatesTags: ['SignIn'],
        }),
        signInOauth: build.mutation<SignInResponse, { code: string; redirectUri: string }>({
            query(body) {
                return {
                    url: `auth/user/signIn`,
                    method: 'POST',
                    body: { formData: { AUTHORIZATION: body } },
                };
            },
            invalidatesTags: ['SignIn'],
        }),
        getAuthTypes: build.query<AuthTypesResponse, string>({
            query: (userName) => `user/${userName}?attribute=authType`,
            providesTags: ['UserAuthTypes'],
        }),
        getAuthProviders: build.query<{ oauth: AuthProvider[] }, void>({
            query: () => `/auth/user/signIn`,
            providesTags: ['AuthProviders'],
            transformResponse: (res: { oauth: AuthProvider[] }) => {
                return {
                    oauth: res.oauth.map((obj) => ({
                        ...obj,
                        authUrl: obj.authUrl + `&redirect_uri=${buildRedirectUri()}`,
                    })),
                };
            },
        }),
    }),
});

export const { useSignInMutation, useLazyGetAuthTypesQuery, useGetAuthProvidersQuery, useSignInOauthMutation } =
    signInApi;
