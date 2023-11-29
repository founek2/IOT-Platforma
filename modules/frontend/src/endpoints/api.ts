import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: async (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const authorization = (getState() as RootState).application.authorization;
        if (!authorization.loggedIn) return headers

        const expired = authorization.accessTokenExpiresAt < Date.now() / 1000;
        if (authorization.accessToken && !expired) {
            headers.set('Authorization', `Bearer ${authorization.accessToken}`);
        }

        // TODO handle error cases - expired, atd...
        // TODO should use localStorage for storing access token
        if (expired) {
            const res = await fetch("/api/auth/user/signIn/refresh", {
                method: "POST",
                body: JSON.stringify({ formData: { REFRESH_TOKEN: { token: authorization.refreshToken } } }),
            })
            const body = await res.json()

            headers.set('Authorization', `Bearer ${body.accessToken}`);
        }

        return headers;
    },
});

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const api = createApi({
    /**
     * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
     */
    baseQuery,
    /**
     * Tag types must be defined in the original API definition
     * for any tags that would be provided by injected endpoints
     */
    tagTypes: [
        'SignIn',
        'Devices',
        'AuthProviders',
        'UserAuthTypes',
        'UserNames',
        'History',
        'Users',
        'DiscoveredDevices',
        'AccessTokens',
        'NotificationConfig',
        'ThingNotifications',
    ],
    /**
     * This api has endpoints injected in adjacent files,
     * which is why no endpoints are shown below.
     * If you want all endpoints defined in the same file, they could be included here instead
     */
    endpoints: () => ({}),
});

export const enhancedApi = api.enhanceEndpoints({
    endpoints: () => ({
        getPost: () => 'test',
    }),
});
