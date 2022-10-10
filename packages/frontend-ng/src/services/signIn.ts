import { AuthType } from 'common/src/constants';
import { IUser } from 'common/src/models/interface/userInterface';
import { api } from './api';

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
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
