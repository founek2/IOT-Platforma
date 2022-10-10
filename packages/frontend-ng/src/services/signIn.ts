import { AuthType } from 'common/src/constants';
import { api } from './api';

export interface SignInResponse {
    token: string;
}

export interface AuthTypesResponse {
    authTypes: AuthType[];
}

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
        getAuthTypes: build.query<AuthTypesResponse, string>({
            query: (userName) => `user/${userName}?attribute=authType`,
            providesTags: ['AuthTypes'],
        }),
    }),
});

export const { useSignInMutation, useLazyGetAuthTypesQuery } = signInApi;
