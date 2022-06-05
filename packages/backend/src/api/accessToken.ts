import fieldDescriptors from '@common/fieldDescriptors';
import { IUser } from '@common/models/interface/userInterface';
import { UserModel } from '@common/models/userModel';
import { UserService } from '@common/services/userService';
import { map, omit } from 'ramda';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import checkWritePerm from '../middlewares/user/checkWritePerm';
import { ObjectId } from '../utils/objectId';

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
            index: [tokenAuthMIddleware(), checkWritePerm({ paramKey: 'userId' })],
            create: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'userId' }),
                formDataChecker(fieldDescriptors, { allowedForms: ['ADD_ACCESS_TOKEN'] }),
            ],
            deleteId: [tokenAuthMIddleware(), checkWritePerm({ paramKey: 'userId' })],
            modifyId: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'userId' }),
                formDataChecker(fieldDescriptors, { allowedForms: ['EDIT_ACCESS_TOKEN'] }),
            ],
        },
        /** GET / - List all users in system
         * @restriction regular user - list only userNames, admin - list all users
         * @header Authorization-JWT
         */
        async index({ user }: any, res) {
            const doc = await UserModel.findOne({ _id: ObjectId(user._id) })
                .select('accessTokens')
                .lean();
            if (!doc) return res.sendStatus(404);

            res.send({ docs: map(omit(['token']), doc.accessTokens || []) });
        },

        async create({ body, user }: any, res) {
            const token = await UserService.createAccessToken(body.formData.ADD_ACCESS_TOKEN, user._id);
            token.ifRight((doc) => res.send({ doc })).ifLeft((error) => res.status(500).send({ error }));
        },

        async modifyId({ body, user, params }: any, res) {
            await UserService.updateAccessToken(params.id, user._id, body.formData.EDIT_ACCESS_TOKEN);
            res.sendStatus(204);
        },

        async deleteId({ user, params }: any, res) {
            await UserService.deleteAccessToken(params.id, user._id);
            res.sendStatus(204);
        },
    });
