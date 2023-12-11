import { OAuthProvider } from 'common/lib/models/interface/userInterface';
import { RequestWithAuth } from 'common/lib/types';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { logger } from 'common/lib/logger';
import { HasContext } from '../types';
import { UserModel } from 'common';

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
            const result = await UserModel.invalidateRefreshToken(user._id, user.refreshTokenId);
            if (result.nModified !== 1) return res.sendStatus(404)

            res.sendStatus(204);

            // (await context.userService.getAuthorization(user._id))
            //     .ifJust(async (oauth) => {
            //         context.userService.removeAuthorization(user._id);

            //         const result = await context.oauthService.revokeToken(
            //             oauth.accessToken,
            //             oauth.refreshToken,
            //             'refresh_token',
            //             oauth.provider
            //         );
            //         result.ifNothing(() => {
            //             logger.warning('signOut: Unable to revoke', oauth);
            //         });
            //     });
        },
    });
