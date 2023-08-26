import fieldDescriptors from 'common/lib/fieldDescriptors.js';
import formDataChecker from 'common/lib/middlewares/formDataChecker.js';
import resource from 'common/lib/middlewares/resource-router-middleware.js';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth.js';
import checkWritePerm from 'common/lib/middlewares/user/checkWritePerm.js';
import { UserModel } from 'common/lib/models/userModel.js';
import { UserService } from 'common/lib/services/userService.js';
import { RequestWithAuth } from 'common/lib/types.js';
import { map, omit } from 'ramda';
import { ObjectId } from '../utils/objectId.js';

type Params = { userId: string };
type Request = RequestWithAuth<Params>;
type RequestId = RequestWithAuth<Params & { id: string }>;

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
        async index({ user }: Request, res) {
            const doc = await UserModel.findOne({ _id: ObjectId(user._id) })
                .select('accessTokens')
                .lean();
            if (!doc) return res.sendStatus(404);

            res.send({ docs: map(omit(['token']), doc.accessTokens || []) });
        },

        async create({ body, user }: Request, res) {
            const token = await UserService.createAccessToken(body.formData.ADD_ACCESS_TOKEN, user._id);
            token.ifRight((doc) => res.send({ doc })).ifLeft((error) => res.status(500).send({ error }));
        },

        async modifyId({ body, user, params }: RequestId, res) {
            await UserService.updateAccessToken(params.id, user._id, body.formData.EDIT_ACCESS_TOKEN);
            res.sendStatus(204);
        },

        async deleteId({ user, params }: RequestId, res) {
            await UserService.deleteAccessToken(params.id, user._id);
            res.sendStatus(204);
        },
    });
