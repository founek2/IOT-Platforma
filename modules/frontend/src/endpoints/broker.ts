import { api } from './api';

export type BrokerConnectionItem = {
    name: string //"10.10.5.7:47002 -> 10.10.5.5:15675"
    vhost: string
    user: string
    node: string
};
export type BrokerData = {
    overview: any,
    connections: {
        total_count: number
        item_count: number
        items: BrokerConnectionItem[]
    }
    updatedAt: string
}

export const brokerApi = api.injectEndpoints({
    endpoints: (build) => ({
        broker: build.query<BrokerData, void>({
            query: () => `broker`,
            providesTags: ['Broker'],
            transformResponse: (body: any) => body.data,
        }),
    }),
});

export const { useBrokerQuery } = brokerApi;
