import { IDevice } from 'common/src/models/interface/device';
import { api } from './api';
import { SignInResponse, User } from './signIn';

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

export interface EditUserFormData {
    info: {
        userName: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
    auth?: {
        password: string;
    };
    groups: string[];
}

type userNamesResponse = { data: { _id: string; userName: string }[] };
export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        subscribeToNotification: build.mutation<undefined, { userId: string; data: PushSubscription }>({
            query: ({ userId, data }) => ({
                url: `user/${userId}/notification`,
                method: 'POST',
                body: { formData: { ADD_PUSH_SUBSCRIPTION: data } },
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useSubscribeToNotificationMutation
} = usersApi;
