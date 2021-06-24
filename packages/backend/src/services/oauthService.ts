import fetch from 'node-fetch';
import config from 'common/lib/config';
import { OAuthProvider } from 'common/lib/models/interface/userInterface';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';

const oauth = config.oauth;

export interface Authorization {
    access_token: string;
    account_name: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    user_id: number;
    status: number; // 200
    messsage: string; // "ok"
}

export async function requestAuthorization(code: string, provider: OAuthProvider): Promise<Maybe<Authorization>> {
    try {
        const res = await fetch('https://login.szn.cz/api/v1/oauth/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: oauth?.redirectUri,
                client_secret: oauth?.clientSecret,
                client_id: oauth?.clientId,
            }),
        });

        const body = (await res.json()) as Authorization;
        if (body.status === 200) throw new Error('invalid status');

        return Just(body);
    } catch (err) {
        return Nothing;
    }
}
