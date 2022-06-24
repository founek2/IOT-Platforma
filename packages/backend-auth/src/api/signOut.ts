import { OAuthProvider } from 'common/src/models/interface/userInterface';
import { UserService } from 'common/src/services/userService';
import { RequestWithAuth } from 'common/src/types';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { OAuthService } from '../services/oauthService';

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
                    (
                        await OAuthService.revokeToken(
                            oauth.accessToken,
                            oauth.refreshToken,
                            'refresh_token',
                            OAuthProvider.seznam
                        )
                    ).ifJust(() => {
                        UserService.removeAuthorization(user._id);
                        res.sendStatus(204);
                    });
                });
        },
    });
