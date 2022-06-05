import { OAuthProvider } from '@common/models/interface/userInterface';
import { UserService } from '@common/services/userService';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import { OAuthService } from '../services/oauthService';

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
