import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser } from 'common/lib/models/interface/userInterface';
import { TokenModel } from 'common/lib/models/tokenModel';
import { UserModel } from 'common/lib/models/userModel';
import { UserService } from 'common/lib/services/userService';
import { RequestWithAuth } from 'common/lib/types';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import { rateLimiterMiddleware } from 'common/lib/middlewares/rateLimiter';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import checkWritePerm from 'common/lib/middlewares/user/checkWritePerm';
import eventEmitter from '../services/eventEmitter';
import { Request } from 'express';
import { getAllowedGroups } from 'common/lib/constants/privileges';

function removeUserItself(id: IUser['_id']) {
    return function (doc: IUser) {
        return doc._id != id; // dont change to !==
    };
}

type RequestIndex = RequestWithAuth<{}, { type?: string }>;
type RequestRead = RequestWithAuth<{ id: string }, { attribute?: string }>;
type RequestId = RequestWithAuth<{ id: string }>;

/**
 * URL prefix /user
 */
export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            create: [
                rateLimiterMiddleware,
                formDataChecker(fieldDescriptors, {
                    allowedForms: ['REGISTRATION', 'FORGOT', 'FORGOT_PASSWORD'],
                }),
            ],
            replaceId: [
                tokenAuthMIddleware(),
                checkWritePerm(),
                formDataChecker(fieldDescriptors, { allowedForms: ['EDIT_USER', "ADD_PUSH_SUBSCRIPTION"] }),
            ],
            deleteId: [tokenAuthMIddleware(), checkWritePerm()],
        },
        /** GET / - List all users in system
         * @restriction regular user - list only userNames, admin - list all users
         * @header Authorization-JWT
         * @param type optional, specify property of user, supported: userName
         * @return json
         *              - type == userName { data: { _id: string, userName: string }[] }
         *              - default { users: IUser[] }
         */
        async index({ user, root, query: { type } }: RequestIndex, res) {
            if (user && type === 'userName') {
                // tested
                const docs = await UserModel.findAllUserNames();
                res.send({ data: docs.map(({ _id, info: { userName } }) => ({ _id, userName })) });
            } else if (root) {
                const docs = await UserModel.findAll();
                res.send({ docs: docs.filter(removeUserItself(user._id)).map((obj) => obj.toObject()) });
            } else if (user && user.admin) {
                // tested
                const docs = await UserModel.findAllNotRoot();
                res.send({ docs: docs.filter(removeUserItself(user._id)).map((obj) => obj.toObject()) });
            } else if (user && !user.admin) {
                res.status(403).send({ error: 'InvalidPermissions' });
            } else res.sendStatus(500);
        },

        /** GET /:id - Return an user attribute
         * @param attribute specify an user atribute, supported: AuthType
         * @return json { authType: AuthType }
         */
        async read({ params, query }: RequestRead, res) {
            const { id } = params;
            const { attribute } = query;

            if (attribute === 'authType') {
                const doc = await UserModel.findByUserName(id);
                if (!doc) res.send({ authTypes: [] });
                else res.send({ authTypes: doc.auth.types });
            } else {
                res.sendStatus(400);
            }
        },

        /** POST / - Do something based on body content
         * @body form
         * - LOGIN check provided credentials
         * - REGISTRATION register new user
         * - FORGOT send email with link to change password
         * - FORGOT_PASSWORD - change password to user determined by one time use token
         * @return json
         * - LOGIN | REGISTRATION { user: IUser, token: JwtToken }
         */
        async create(req: Request, res) {
            const { formData } = req.body;

            if (formData.REGISTRATION) {
                if (await UserModel.exists({ 'info.userName': formData.REGISTRATION.info.userName }))
                    return res.status(409).send({ error: 'userNameAlreadyExist' });
                if (await UserModel.exists({ 'info.email': formData.REGISTRATION.info.email })) {
                    console.log(await UserModel.find());
                    return res.status(409).send({ error: 'emailAlreadyExist' });
                }

                const { doc, token } = await UserService.create(formData.REGISTRATION);

                res.send({
                    user: doc,
                    token,
                });
                eventEmitter.emit('user_signup', { id: doc._id, info: doc.info });
            } else if (formData.FORGOT) {
                eventEmitter.emit('user_forgot', { email: formData.FORGOT.email });
                res.sendStatus(204);
            } else if (formData.FORGOT_PASSWORD) {
                const token = await TokenModel.retrieve(formData.FORGOT_PASSWORD.token);
                if (!token) return res.sendStatus(400);

                (await UserService.changePassword(token.userId, formData.FORGOT_PASSWORD.password))
                    .ifRight(() => res.sendStatus(204))
                    .ifLeft((error) => res.status(400).send({ error }));
            } else {
                res.sendStatus(400);
            }
        },

        /** DELETE /:id - Delete provided user
         * @restriction user is admin or is deleting himself
         * @header Authorization-JWT
         */
        async deleteId({ params }: RequestId, res) {
            await UserService.deleteById(params.id);
            res.sendStatus(204);
        },

        async replaceId({ body, params, user }: RequestId, res) {
            const { id } = params;
            if (body.formData.EDIT_USER) {
                const allowedGroups = getAllowedGroups(user.groups);
                if (!body.formData.EDIT_USER.groups.every((group: string) => allowedGroups.includes(group)))
                    return res.sendStatus(403);

                (await UserService.updateUser(id, body.formData.EDIT_USER))
                    .ifRight(() => res.sendStatus(204))
                    .ifLeft((error) => res.status(400).send({ error }));
            } else if (body.formData.FIREBASE_ADD) {
                await UserModel.addNotifyToken(id, body.formData.FIREBASE_ADD.token);
                res.sendStatus(204);
            } else if (body.formData.ADD_PUSH_SUBSCRIPTION) {
                await UserModel.addNotifyToken(id, body.formData.ADD_PUSH_SUBSCRIPTION);
                res.sendStatus(204);
            } else res.sendStatus(400);
        },
    });
