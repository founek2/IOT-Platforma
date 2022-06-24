import config from 'common/src/config';
import { compose, lensProp, over, pick } from 'ramda';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { checkIsRoot } from 'common/src/middlewares/user/checkIsRoot';

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
