import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import { getProperty } from 'common/lib/utils/getProperty';
import { getThing } from 'common/lib/utils/getThing';
import checkRealmReadPerm from 'common/lib/middlewares/device/checkRealmReadPerm';
import { Context, HasContext } from '../../types';
import Router from '@koa/router';
import Koa from "koa"
import { tokenAuthMiddleware } from 'common/lib/middlewares/tokenAuthMiddleware';
import { checkRealmReadPermissionMiddleware } from 'common/lib/middlewares/device/checkRealmReadPermissionMiddleware';
import { sendError } from 'common/lib/utils/sendError';

type Params = { realm: string; deviceId: string; nodeId: string, propertyId: string };
type RequestQuery = RequestWithAuth<Params, { property?: string; value?: string }>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId/property/:propertyId/state
 */
export default () => {
    let api = new Router<Koa.DefaultState, Context>();

    api.get("/:id",
        tokenAuthMiddleware(),
        checkRealmReadPermissionMiddleware({ paramKey: 'deviceId' }),
        async (ctx) => {
            const { realm, deviceId, nodeId, propertyId } = ctx.params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return ctx.status = 404

            const thing = getThing(doc, nodeId);
            if (!thing) return sendError(404, 'thingNotFound', ctx);

            const property = getProperty(thing, propertyId);
            if (!property) return sendError(404, 'propertyNotFound', ctx);

            const state = thing.state?.propertyId;

            ctx.body = state || {};
        }
    )

    return api;
}


// export const a = () =>
//     resource({
//         mergeParams: true,
//         middlewares: {
//             read: [tokenAuthMIddleware(), checkRealmReadPerm({ paramKey: 'deviceId' })],
//         },

//         async index({ params, context }: RequestQuery & HasContext, res) {
//             const { realm, deviceId, nodeId, propertyId } = params;

//             const doc = await DeviceModel.findByRealm(realm, deviceId);
//             if (!doc) return res.sendStatus(404);

//             const thing = getThing(doc, nodeId);
//             if (!thing) return res.status(404).send("Thing not found");

//             const property = getProperty(thing, propertyId);
//             if (!property) return res.status(404).send("Property not found");

//             const state = thing.state?.propertyId;

//             res.send(state || {})
//         },
//     });
