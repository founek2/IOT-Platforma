import fetch from 'node-fetch';
import config from '@common/config';
import { OAuthProvider } from '@common/models/interface/userInterface';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { logger } from '@framework-ui/logger';

const oauth = config.oauth;

export interface Authorization {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string; // bearer
    status: number; // 200
    messsage: string; // "ok"

    oauth_user_id: string;
    username: string; // část uživatelského jména (tj. e-mailové adresy) před zavináčem
    domain: string; // část uživatelského jména (tj. e-mailové adresy) za zavináčem
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
    static async requestAuthorization(
        code: string,
        redirectUri: string,
        provider: OAuthProvider
    ): Promise<Maybe<Authorization>> {
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
                    redirect_uri: redirectUri,
                    client_secret: oauth.seznam.clientSecret,
                    client_id: oauth.seznam.clientId,
                }),
            });

            const body = (await res.json()) as Authorization;
            if (body.status !== 200) throw new Error('invalid status ' + body.status);

            (body as Authorization & { email: string }).email = body.username + '@' + body.domain;
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
            console.log(res.status, body);
            if (body.status !== 200) throw new Error('invalid status ' + JSON.stringify(body));

            return Just(body);
        } catch (err) {
            logger.error(err);
            return Nothing;
        }
    }
}
