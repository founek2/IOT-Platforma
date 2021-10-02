import fetch from 'node-fetch';
import config from 'common/lib/config';
import { OAuthProvider } from 'common/lib/models/interface/userInterface';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { logger } from 'framework-ui/lib/logger';

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

export interface RevokeBody {
    message: 'ok';
    status: number;
}

export interface RevokeErrorBody {
    message: string;
    error: string;
}

export class OAuthService {
    static async requestAuthorization(code: string, provider: OAuthProvider): Promise<Maybe<Authorization>> {
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
                    redirect_uri: oauth.seznam.redirectUri,
                    client_secret: oauth.seznam.clientSecret,
                    client_id: oauth.seznam.clientId,
                }),
            });

            const body = (await res.json()) as Authorization;
            if (body.status !== 200) throw new Error('invalid status ' + body.status);

            return Just(body);
        } catch (err) {
            logger.error(err);
            return Nothing;
        }
    }

    static async revokeToken(
        authToken: string,
        token: string,
        tokenType: 'refresh_token' | 'access_token',
        provider: OAuthProvider
    ) {
        try {
            const res = await fetch('https://login.szn.cz/api/v1/oauth/revoke', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'bearer ' + authToken,
                },
                body: JSON.stringify({
                    token_type_hint: tokenType,
                    token,
                }),
            });

            const body = (await res.json()) as RevokeBody;
            if (body.status !== 200) throw new Error('invalid status ' + JSON.stringify(body));

            return Just(body);
        } catch (err) {
            logger.error(err);
            return Nothing;
        }
    }
}
