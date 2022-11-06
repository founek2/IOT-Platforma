import { IDevice } from 'common/src/models/interface/device';
import { api } from './api';

type userNamesResponse = { data: { _id: string; userName: string }[] };
export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        userNames: build.query<userNamesResponse['data'], undefined>({
            query: () => `user?type=userName`,
            providesTags: ['UserNames'],
            transformResponse: (res: userNamesResponse) => res.data,
        }),
    }),
});

export const { useUserNamesQuery } = usersApi;
