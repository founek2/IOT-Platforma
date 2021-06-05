import { AuthTypes } from 'common/lib/constants';
import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser } from 'common/lib/models/interface/userInterface';
import { TokenModel } from 'common/lib/models/tokenModel';
import { UserModel } from 'common/lib/models/userModel';
import { UserService } from 'common/lib/services/userService';
import { getAllowedGroups } from 'framework-ui/lib/privileges';
import formDataChecker from '../middlewares/formDataChecker';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import checkWritePerm from '../middlewares/user/checkWritePerm';
import eventEmitter from '../services/eventEmitter';
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
            index: [tokenAuthMIddleware()],
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

            res.send({ doc: doc.accessTokens });
        },

        async create({ body, user }: any, res) {
            const doc = await UserService.createAccessToken(body.formData.ADD_ACCESS_TOKEN, user._id);
            res.send({ doc });
        },

        async modifyId({ body, user, params }: any, res) {
            const doc = await UserService.updateAccessToken(params.id, user._id, body.formData.EDIT_ACCESS_TOKEN);
            res.send({ doc });
        },

        async deleteId({ user, params }: any, res) {
            await UserService.deleteAccessToken(params.id, user._id);
            res.sendStatus(204);
        },
    });
