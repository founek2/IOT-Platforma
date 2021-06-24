import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser, OAuthProvider } from 'common/lib/models/interface/userInterface';
import { UserService } from 'common/lib/services/userService';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import eventEmitter from '../services/eventEmitter';
import { requestAuthorization } from '../services/oauthService';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { EitherAsync } from 'purify-ts/EitherAsync';

function removeUserItself(id: IUser['_id']) {
    return function (doc: IUser) {
        return doc._id != id; // dont change to !==
    };
}

/**
 * URL prefix /user
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

        async create({ body, user }: any, res) {
            const { formData } = body;

            if (formData.LOGIN) {
                const processLogin = EitherAsync(async ({ fromPromise }) => {
                    return await fromPromise(UserService.checkCreditals(formData.LOGIN));
                });

                (await processLogin.run())
                    .ifLeft((error) => res.status(401).send({ error }))
                    .ifRight(({ doc, token }) => {
                        res.send({ user: doc, token });
                        eventEmitter.emit('user_login', doc);
                    });
            } else if (formData.AUTHORIZATION) {
                const processAuth = MaybeAsync(async ({ fromPromise, liftMaybe }) => {
                    const auth = await fromPromise(
                        requestAuthorization(body.formData.AUTHORIZATION.code, OAuthProvider.seznam)
                    );
                    return await fromPromise(
                        UserService.refreshAuthorization(auth.account_name, {
                            accessToken: auth.access_token,
                            expiresIn: auth.expires_in,
                            refreshToken: auth.refresh_token,
                            tokenType: auth.token_type,
                            userId: auth.user_id,
                            provider: OAuthProvider.seznam,
                        })
                    );
                });

                (await processAuth.run())
                    .ifJust(({ doc, token }) => {
                        res.send({ user: doc, token });
                        eventEmitter.emit('user_login', doc);
                    })
                    .ifNothing(() => res.sendStatus(500));
            } else res.sendStatus(400);
        },
    });
