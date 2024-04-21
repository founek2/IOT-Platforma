import Router from '@koa/router';
import { checkRealmReadPermissionMiddleware } from "common/lib/middlewares/device/checkRealmReadPermissionMiddleware";
import { tokenAuthMiddleware } from 'common/lib/middlewares/tokenAuthMiddleware';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { getThing } from 'common/lib/utils/getThing';
import { sendError } from 'common/lib/utils/sendError';
import Koa from "koa";
import { Context } from '../../types';

/**
 * URL prefix /device/:deviceId/thing/:nodeId/state
 */
export default () => {
    let api = new Router<Koa.DefaultState, Context>();

    api.get("/",
        tokenAuthMiddleware(),
        checkRealmReadPermissionMiddleware({ paramKey: 'deviceId' }),
        async (ctx) => {
            const { realm, deviceId, nodeId } = ctx.params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return ctx.status = 404;

            const thing = getThing(doc, nodeId);
            if (!thing) return sendError(404, 'thingNotFound', ctx);

            ctx.body = thing.state || {}
        }
    )

    return api;
}

// export const a= () =>
//     resource({
//         mergeParams: true,
//         middlewares: {
//             index: [tokenAuthMIddleware(), checkRealmReadPerm({ paramKey: 'deviceId' })],
//         },

//         async index({ params, query }: RequestQuery, res) {
//             const { realm, deviceId, nodeId } = params;

//             const doc = await DeviceModel.findByRealm(realm, deviceId);
//             if (!doc) return res.sendStatus(404);

//             const thing = getThing(doc, nodeId);
//             if (!thing) return res.status(404).send("Thing not found");

//             res.send(thing.state || {})
//         },
//     });
