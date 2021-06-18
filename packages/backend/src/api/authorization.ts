import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser, OAuthProvider } from 'common/lib/models/interface/userInterface';
import { UserService } from 'common/lib/services/userService';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import eventEmitter from '../services/eventEmitter';
import { requestAuthorization } from '../services/oauthService';

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
            create: [formDataChecker(fieldDescriptors, { allowedForms: ['AUTHORIZATION', 'LOGIN'] })],
        },

        async create({ body, user }: any, res) {
            const { formData } = body;

            if (formData.LOGIN) {
                const { doc, token, error } = await UserService.checkCreditals(formData.LOGIN);
                if (error) return res.status(401).send({ error });

                res.send({
                    user: doc,
                    token,
                });
                eventEmitter.emit('user_login', doc);
            } else if (formData.AUTHORIZATION) {
                const auth = await requestAuthorization(body.formData.AUTHORIZATION.code, OAuthProvider.seznam);
                if (!auth) return res.sendStatus(400);

                const { doc, token, error } = await UserService.refreshAuthorization(auth.account_name, {
                    accessToken: auth.access_token,
                    expiresIn: auth.expires_in,
                    refreshToken: auth.refresh_token,
                    tokenType: auth.token_type,
                    userId: auth.user_id,
                    provider: OAuthProvider.seznam,
                });
                if (error) return res.status(401).send({ error });
                res.send({
                    user: doc,
                    token,
                });
                eventEmitter.emit('user_login', doc);
            } else res.sendStatus(400);
        },
    });
