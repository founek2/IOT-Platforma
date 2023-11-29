import { OAuthProvider } from 'common/lib/models/interface/userInterface';
import { RequestWithAuth } from 'common/lib/types';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { logger } from 'common/lib/logger';
import { HasContext } from '../types';

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

        async create({ user, context }: Request & HasContext, res) {
            (await context.userService.getAuthorization(user._id))
                .ifNothing(() => res.sendStatus(204))
                .ifJust(async (oauth) => {
                    context.userService.removeAuthorization(user._id);
                    res.sendStatus(204);

                    const result = await context.oauthService.revokeToken(
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
