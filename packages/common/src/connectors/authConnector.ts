import fetch from 'node-fetch';
import { Just, Nothing, Maybe } from 'purify-ts/Maybe';

// /api/auth/rabbitmq/pass
export function AuthConnector(endpointUri: string) {
    return {
        getPass: async function (): Promise<Maybe<{ userName: string; password: string; validTo: Date }>> {
            const res = await fetch(`${endpointUri}/api/auth/rabbitmq/pass`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            return res.status === 200 ? Just((await res.json()).auth) : Nothing;
        },
    };
}
