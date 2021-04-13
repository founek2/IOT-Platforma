import resource from '../middlewares/resource-router-middleware';
import { UserModel } from 'common/lib/models/userModel';
import processError from '../utils/processError';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import formDataChecker from '../middlewares/formDataChecker';
import groupRestriction from '../middlewares/groupRestriction';
import { getAllowedGroups } from 'framework-ui/lib/privileges';

import fieldDescriptors from 'common/lib/fieldDescriptors';
import checkWritePerm from '../middlewares/user/checkWritePerm';
import eventEmitter from '../services/eventEmitter';
import { UserService } from 'common/lib/services/userService';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';
import { IUser } from 'common/lib/models/interface/userInterface';
import checkUser from '../middlewares/user/checkUser';

function removeUserItself(id: IUser["_id"]) {
    return function (doc: IUser) {
        return doc._id != id; // dont change to !==
    };
}

export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            create: [
                rateLimiterMiddleware,
                formDataChecker(fieldDescriptors, { allowedForms: ["LOGIN", "REGISTRATION"] })
            ],
            replaceId: [
                tokenAuthMIddleware(),
                checkWritePerm(),
                formDataChecker(fieldDescriptors, { allowedForms: ["EDIT_USER", "FIREBASE_ADD"] })
            ],
            deleteId: [tokenAuthMIddleware(), checkWritePerm()]
        },
        /** GET / - List all entities */
        async index({ user, root, query: { type } }: any, res) {
            // console.log(user)
            if (user && type === 'userName') {
                // tested
                console.log('retrieving userNames');
                const docs = await UserModel.findAllUserNames();
                res.send({ data: docs.map(({ _id, info: { userName } }) => ({ _id, userName })) });
            } else if (root) {
                const docs = await UserModel.findAll();
                res.send({ users: docs.filter(removeUserItself(user.id)).map((obj) => obj.toObject()) });
            } else if (user && user.admin) {
                // tested
                const docs = await UserModel.findAllNotRoot();
                res.send({ users: docs.filter(removeUserItself(user.id)).map((obj) => obj.toObject()) });
            } else res.sendStatus(500);
        },

        /** GET /:id - Return a given entity */
        async read({ params, query }, res) {
            const { id } = params;
            const { attribute } = query;

            if (attribute === 'authType') {
                const doc = await UserModel.findByUserName(id);

                if (!doc) res.status(404).send({ error: "unknownUser" })
                else res.send({ authType: doc.auth.type });
            } else {
                res.sendStatus(400);
            }
        },

        /** POST / - Create a new entity */
        async create(req, res) {
            const { formData } = req.body;

            if (formData.LOGIN) {

                const { doc, token, error } = await UserService.checkCreditals(formData.LOGIN);
                if (error) return res.status(500).send({ error })

                res.send({
                    user: doc,
                    token
                });
                eventEmitter.emit('user_login', doc);

            } else if (formData.REGISTRATION) {
                if (UserModel.exists({ "info.userName": formData.REGISTRATION.info.userName }))
                    return res.status(400).send({ error: "userNameAlreadyExist" })
                const { doc, token } = await UserService.create(formData.REGISTRATION);

                res.send({
                    user: doc,
                    token
                });
                eventEmitter.emit('user_signup', { id: doc._id, info: doc.info });
            } else {
                res.sendStatus(400);
            }
        },


        async deleteId({ params }, res) {
            await UserService.deleteById(params.id);
            res.sendStatus(204);
        },

        async replaceId({ body, params, user }: any, res) {
            const { id } = params;
            if (body.formData.EDIT_USER) {
                const allowedGroups = getAllowedGroups(user.groups).map((obj) => obj.name);

                if (!body.formData.EDIT_USER.groups.every((group: string) => allowedGroups.includes(group)))
                    return res.sendStatus(403);

                await UserService.updateUser(id, body.formData.EDIT_USER);
                res.sendStatus(204);
            } else if (body.formData.FIREBASE_ADD) {
                await UserModel.addNotifyToken(id, body.formData.FIREBASE_ADD.token);
                res.sendStatus(204);
            } else res.sendStatus(400);
        }
    });
