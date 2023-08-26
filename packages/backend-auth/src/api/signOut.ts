import { OAuthProvider } from 'common/lib/models/interface/userInterface.js';
import { UserService } from 'common/lib/services/userService.js';
import { RequestWithAuth } from 'common/lib/types.js';
import resource from 'common/lib/middlewares/resource-router-middleware.js';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth.js';
import { OAuthService } from '../services/oauthService.js';
import { logger } from 'common/lib/logger';

type Request = RequestWithAuth;

/**
 * URL prefix /authorization/signOut
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [tokenAuthMIddleware()],
        },

        async create({ user }: Request, res) {
            (await UserService.getAuthorization(user._id))
                .ifNothing(() => res.sendStatus(204))
                .ifJust(async (oauth) => {
                    UserService.removeAuthorization(user._id);
                    res.sendStatus(204);

                    const result = await OAuthService.revokeToken(
                        oauth.accessToken,
                        oauth.refreshToken,
                        'refresh_token',
                        OAuthProvider.seznam
                    );
                    result.ifNothing(() => {
                        logger.warning('signOut: Unable to revoke', oauth);
                    });
                });
        },
    });
