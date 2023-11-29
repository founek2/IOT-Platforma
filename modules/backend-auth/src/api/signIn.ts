import { fieldDescriptors } from 'common';
import { OAuthProvider } from 'common/lib/models/interface/userInterface';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import { rateLimiterMiddleware } from 'common/lib/middlewares/rateLimiter';
import resource from 'common/lib/middlewares/resource-router-middleware';
import eventEmitter from '../services/eventEmitter';
import { Request } from 'express';
import { HasContext } from '../types';

/**
 * URL prefix /authorization
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [
                rateLimiterMiddleware,
                formDataChecker(fieldDescriptors, { allowedForms: ['AUTHORIZATION', 'LOGIN'] }),
            ],
        },

        async index(req: Request & HasContext, res) {
            const oauthArray: Array<any> = [];
            if (req.context.oauthService) {
                const { clientId, endpoint, scopes, iconUrl } = req.context.oauthService.oauth.seznam;
                oauthArray.push({
                    provider: 'seznam',
                    iconUrl,
                    authUrl: `${endpoint}?client_id=${clientId}&scope=${scopes.join('%20')}&response_type=code`,
                });
            }

            res.send({
                oauth: oauthArray,
            });
        },

        async create({ body, context }: Request & HasContext, res) {
            const { formData } = body;

            if (formData.LOGIN) {
                (await context.userService.checkCreditals(formData.LOGIN))
                    .ifLeft((error) => res.status(401).send({ error }))
                    .ifRight(({ doc, accessToken, refreshToken }) => {
                        res.send({
                            user: doc,
                            token: accessToken,
                            accessToken,
                            refreshToken,
                        });
                        eventEmitter.emit('user_login', doc);
                    });
            } else if (formData.AUTHORIZATION) {
                const processAuth = MaybeAsync(async ({ fromPromise, liftMaybe }) => {
                    const auth = await fromPromise(
                        context.oauthService.requestAuthorization(
                            body.formData.AUTHORIZATION.code,
                            body.formData.AUTHORIZATION.redirectUri,
                            OAuthProvider.seznam
                        )
                    );

                    return await fromPromise(
                        context.userService.refreshAuthorization(
                            auth.email,
                            auth.email.replace(/@.*$/, '').replace(/\./g, ''),
                            {
                                accessToken: auth.access_token,
                                expiresIn: auth.expires_in,
                                refreshToken: auth.refresh_token,
                                tokenType: auth.token_type,
                                provider: OAuthProvider.seznam,
                            }
                        )
                    );
                });

                (await processAuth.run())
                    .ifJust(({ doc, token, oldOauth }) => {
                        res.send({ user: doc, token });
                        eventEmitter.emit('user_login', doc);
                        if (oldOauth)
                            context.oauthService.revokeToken(
                                oldOauth.accessToken,
                                oldOauth.refreshToken,
                                'refresh_token',
                                oldOauth.provider
                            );
                    })
                    .ifNothing(() => res.sendStatus(500));
            } else res.sendStatus(400);
        },
    });
