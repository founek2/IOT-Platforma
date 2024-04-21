import { RequestWithAuth } from 'common/lib/types';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { checkIsRoot } from 'common/lib/middlewares/user/checkIsRoot';
import { Context, HasContext } from '../types';
import Router from '@koa/router';
import Koa from "koa"
import { tokenAuthMiddleware } from 'common/lib/middlewares/tokenAuthMiddleware';
import { checkIsRootMiddleware } from 'common/lib/middlewares/user/checkIsRootMiddleware';

type Request = RequestWithAuth & HasContext;

/**
 * URL prefix /broker
 */
export default () => {
    let api = new Router<Koa.DefaultState, Context>();

    api.get("/",
        tokenAuthMiddleware(),
        checkIsRootMiddleware(),
        async (ctx) => {
            const data = await ctx.brokerService.getData();

            ctx.body = {
                data: data.extractNullable()
            }
        }
    )

    return api;
}

// export const a = () =>
//     resource({
//         mergeParams: true,
//         middlewares: {
//             index: [tokenAuthMIddleware(), checkIsRoot()],
//         },
//         /** GET / - List all users in system
//          * @restriction regular user - list only userNames, admin - list all users
//          * @header Authorization-JWT
//          */
//         async index(req: Request, res) {
//             const data = await req.context.brokerService.getData();

//             res.send({
//                 data: data.extractNullable()
//             });
//         },
//     });
