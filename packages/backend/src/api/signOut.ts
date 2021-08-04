import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser, OAuthProvider } from 'common/lib/models/interface/userInterface';
import { UserService } from 'common/lib/services/userService';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import eventEmitter from '../services/eventEmitter';
import { OAuthService } from '../services/oauthService';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { EitherAsync } from 'purify-ts/EitherAsync';
import tokenAuthMIddleware from '../middlewares/tokenAuth';

/**
 * URL prefix /authorization/signOut
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [tokenAuthMIddleware()],
        },

        async create({ user }: any, res) {
            (await UserService.getAuthorization(user.id))
                .ifNothing(() => res.sendStatus(204))
                .ifJust(async (oauth) => {
                    (
                        await OAuthService.revokeToken(
                            oauth.accessToken,
                            oauth.refreshToken,
                            'refresh_token',
                            OAuthProvider.seznam
                        )
                    ).ifJust(() => {
                        UserService.removeAuthorization(user.id);
                        res.sendStatus(204);
                    });
                });
        },
    });
