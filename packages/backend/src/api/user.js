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

function removeUser(id) {
    return function(doc) {
        return doc.id != id; // dont change to !==
    };
}

function canDeleteUser() {}

export default ({ config, db }) =>
    resource({
        middlewares: {
            index: [ tokenAuthMIddleware() ],
            updateId: [ tokenAuthMIddleware(), checkWritePerm(), formDataChecker(fieldDescriptors) ], // TODO add test when user can change his userName
            create: [ formDataChecker(fieldDescriptors), rateLimiterMiddleware ],
            delete: [ tokenAuthMIddleware(), groupRestriction('admin'), formDataChecker(fieldDescriptors) ],
            deleteId: [ tokenAuthMIddleware(), checkWritePerm() ]
        },
        /** GET / - List all entities */
        async index({ user, root, query: { type } }, res) {
            // console.log(user)
            if (user && type === 'userName') {
                // tested
                console.log('retrieving userNames');
                const docs = await UserModel.findAllUserNames();
                res.send({ data: docs.map(({ _id, info: { userName } }) => ({ _id, userName })) });
            } else if (root) {
                const docs = await UserModel.findAll();
                res.send({ users: docs.filter(removeUser(user.id)).map((obj) => obj.toObject()) });
            } else if (user && user.admin) {
                // tested
                const docs = await UserModel.findAllNotRoot();
                res.send({ users: docs.filter(removeUser(user.id)).map((obj) => obj.toObject()) });
            } else res.sendStatus(500);
        },

        /** POST / - Create a new entity */
        async create(req, res) {
            const { formData } = req.body;

            if (formData.LOGIN) {
                // tested 2
                const { doc, token } = await UserService.checkCreditals(formData.LOGIN);
                const { groups, id, allowedSensors, allowedControlls, info, auth, deviceUser } = doc;
                res.send({
                    user: {
                        groups,
                        id,
                        allowedSensors,
                        allowedControlls,
                        info,
                        auth: { type: auth.type },
                        deviceUser
                    },
                    token
                });
                eventEmitter.emit('user_login');

                // .catch(processError(res));
            } else if (formData.REGISTRATION) {
                // tested
                const { doc, token } = await UserService.create(formData.REGISTRATION);
                res.send({
                    user: doc,
                    token
                });
                eventEmitter.emit('user_signup', { id: doc._id, info, groups });

                // .catch(processError(res));
            } else {
                res.sendStatus(400);
            }
        },

        /** GET /:id - Return a given entity */
        async read({ params, query }, res) {
            const { id } = params;
            const { attribute } = query;

            if (attribute === 'authType' && id) {
                // tested
                const doc = await UserModel.findByUserName(id);

                if (doc) res.send({ authType: doc.auth.type });
                else res.status(208).send({ error: 'unknownUser' });
            } else {
                res.sendStatus(400);
            }
        },

        /** PUT /:id - Create a given entity */

        /** DELETE - Delete a given entities */
        async delete({ body }, res) {
            // tested
            console.log('data', body.formData);
            const success = await Promise.all(body.formData.USER_MANAGEMENT.selected.map(UserService.deleteById));
            if (success.every(Boolean)) res.sendStatus(204);
            else res.sendStatus(500);
        },

        async deleteId({ body, params }, res) {
            // tested
            console.log('data', body.formData);
            const success = await UserService.deleteById(params.id);
            if (success) res.sendStatus(204);
            else res.sendStatus(500);
        },

        async updateId({ body, params, user }, res) {
            // tested
            const { id } = params;
            if (body.formData.EDIT_USER) {
                const allowedGroups = getAllowedGroups(user.groups).map((obj) => obj.name);

                // TODO this is not Tested!!!!
                if (!body.formData.EDIT_USER.groups.every((group) => allowedGroups.includes(group)))
                    return res.sendStatus(403);

                await UserService.updateUser(id, body.formData.EDIT_USER);
                res.sendStatus(204);
            } else if (body.formData.FIREBASE_ADD) {
                await UserModel.addNotifyToken(id, body.formData.FIREBASE_ADD.token);
                res.sendStatus(204);
            } else res.sendStatus(400);
        }
    });
