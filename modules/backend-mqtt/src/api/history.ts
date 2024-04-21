import Router from '@koa/router';
import { readDevicePermissionMiddleware } from 'common/lib/middlewares/device/readDevicePermissionMiddleware';
import { tokenAuthMiddleware } from 'common/lib/middlewares/tokenAuthMiddleware';
import type Koa from "koa";
import { Context } from '../types';

/**
 * URL prefix /device/:deviceId/thing/:thingId/history
 */
export default () => {
    let api = new Router<Koa.DefaultState, Context>();

    api.get("/",
        tokenAuthMiddleware(),
        readDevicePermissionMiddleware({ paramKey: 'deviceId' }),
        async (ctx) => {
            const { deviceId, thingId } = ctx.params;
            const { from, to } = ctx.query;

            const rows = await ctx.influxService.getMeasurements(
                deviceId,
                thingId,
                new Date(Number(from)),
                new Date(to ? Number(to) : new Date())
            );

            ctx.body = { docs: rows };
        })

    return api;
}

// export function aaa() {
//     resource({
//         mergeParams: true,
//         middlewares: {
//             read: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })],
//         },
//         /** GET / - List all history data associated with provided thing of device in time period
//          * @restriction user needs read permission
//          * @header Authorization-JWT
//          * @param {Date} from beggining of the time period
//          * @param {Date} to end of the time period, default now
//          * @return json { docs: IHistorical[] }
//          */
//         async index({ params, query: { from, to }, context }: Request & HasContext, res) {
//             const { deviceId, thingId } = params;

//             const rows = await context.influxService.getMeasurements(
//                 deviceId,
//                 thingId,
//                 new Date(Number(from)),
//                 new Date(to ? Number(to) : new Date())
//             );

//             // const docs = await HistoricalModel.getData(
//             //     deviceId,
//             //     thingId,
//             //     new Date(Number(from)),
//             //     new Date(to ? Number(to) : new Date())
//             // );
//             res.send({ docs: rows });
//         },
//     });
// }