import { api } from './api';

export const signOutApi = api.injectEndpoints({
    endpoints: (build) => ({
        signOut: build.mutation<undefined, void>({
            query() {
                return {
                    url: `auth/user/signOut`,
                    method: 'POST',
                };
            },
        }),
    })
})

export const { useSignOutMutation } = signOutApi