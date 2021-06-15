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
import checkUser from '../middlewares/user/checkUser';
import { checkIsRoot } from '../middlewares/user/checkIsRoot';
import config from 'common/lib/config';
import { pick, compose, over, lensProp } from 'ramda';

/**
 * URL prefix /user
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            index: [tokenAuthMIddleware(), checkIsRoot()],
        },
        /** GET / - List all users in system
         * @restriction regular user - list only userNames, admin - list all users
         * @header Authorization-JWT
         */
        async index(req, res) {
            const picked = pick(['port', 'portAuth', 'bodyLimit', 'homepage', 'jwt', 'agenda', 'email'], config);

            const data = compose(
                over(lensProp('email'), pick(['host', 'port', 'secure', 'userName'])),
                // @ts-ignore
                over(lensProp('mqtt'), pick(['url', 'port']))
                // @ts-ignore
            )(picked);
            res.send({ data });
        },

        // async create({ body, user }: any, res) {
        //     const doc = await UserService.createAccessToken(body.formData.ADD_ACCESS_TOKEN, user._id);
        //     res.send({ doc });
        // },

        // async modifyId({ body, user, params }: any, res) {
        //     await UserService.updateAccessToken(params.id, user._id, body.formData.EDIT_ACCESS_TOKEN);
        //     res.sendStatus(204);
        // },

        // async deleteId({ user, params }: any, res) {
        //     await UserService.deleteAccessToken(params.id, user._id);
        //     res.sendStatus(204);
        // },
    });
