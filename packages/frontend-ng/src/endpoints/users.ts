import { IDevice } from 'common/src/models/interface/device';
import { api } from './api';
import { SignInResponse } from './signIn';

export interface RegisterUserForm {
    info: {
        userName: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
    auth: {
        password: string;
    };
}

type userNamesResponse = { data: { _id: string; userName: string }[] };
export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        userNames: build.query<userNamesResponse['data'], undefined>({
            query: () => `user?type=userName`,
            providesTags: ['UserNames'],
            transformResponse: (res: userNamesResponse) => res.data,
        }),
        registerAndSignIn: build.mutation<SignInResponse, RegisterUserForm>({
            query: (data) => ({
                url: 'user',
                method: 'POST',
                body: { formData: { REGISTRATION: data } },
            }),
        }),
        register: build.mutation<undefined, RegisterUserForm>({
            query: (data) => ({
                url: 'user',
                method: 'POST',
                body: { formData: { REGISTRATION: data } },
            }),
        }),
    }),
});

export const { useUserNamesQuery, useRegisterAndSignInMutation, useRegisterMutation } = usersApi;
