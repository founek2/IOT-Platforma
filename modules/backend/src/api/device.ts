import fieldDescriptors from 'common/lib/fieldDescriptors';
import { DeviceModel } from 'common/lib/models/deviceModel';
import checkWritePerm from 'common/lib/middlewares/device/checkWritePerm';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import { DeviceService } from '../services/deviceService';
import eventEmitter from '../services/eventEmitter';
import { IDevice } from 'common/lib/models/interface/device';
import { RequestWithAuth } from 'common/lib/types';
import checkReadPerm from 'common/lib/middlewares/device/checkReadPerm';
import { Context, HasContext } from '../types';
import Router from '@koa/router';
import Koa from "koa"
import { tokenAuthMiddleware } from 'common/lib/middlewares/tokenAuthMiddleware';
import { readDevicePermissionMiddleware } from 'common/lib/middlewares/device/readDevicePermissionMiddleware';
import { writeDevicePermissionMiddleware } from 'common/lib/middlewares/device/writeDevicePermissionMiddleware';
import { formDataMiddleware } from 'common/lib/middlewares/formDataMiddleware';

type Request = RequestWithAuth;
type RequestId = RequestWithAuth & { params: { id: string } } & HasContext;

/**
 * URL prefix /device
 */

export default () => {
    let api = new Router<Koa.DefaultState, Context>();

    api.get("/", tokenAuthMiddleware(), async (ctx) => {
        if (ctx.state.user.admin && ctx.query.filter === "all") {
            const docs = await DeviceModel.find({}).select("info permissions createdBy metadata").lean();
            ctx.body = { docs };
            return;
        }

        const docs = await DeviceModel.findForUser(ctx.state.user._id);
        ctx.body = { docs };
    })

    api.get("/:id",
        tokenAuthMiddleware(),
        readDevicePermissionMiddleware(),
        async (ctx) => {
            const device = await DeviceModel.findById(ctx.params.id);
            ctx.body = device;
        })

    api.patch("/:id",
        tokenAuthMiddleware(),
        writeDevicePermissionMiddleware(),
        formDataMiddleware(fieldDescriptors, { allowedForms: ['EDIT_DEVICE'] }),
        async (ctx) => {
            const { formData } = ctx.request.body;

            const form = formData.EDIT_DEVICE;
            await DeviceModel.updateByFormData(ctx.params.id, form);
            ctx.status = 204;
        })

    api.post("/:id",
        tokenAuthMiddleware(),
        writeDevicePermissionMiddleware(),
        formDataMiddleware(fieldDescriptors, { allowedForms: ['DEVICE_SEND'] }),
        async (ctx) => {
            const { formData } = ctx.request.body;
            const doc: IDevice = await DeviceModel.findById(ctx.params.id).lean();

            if (formData.DEVICE_SEND && (await ctx.actionsService.deviceSendCommand(doc, formData.DEVICE_SEND.command)))
                return ctx.status = 204;

            ctx.status = 400;
        })

    api.delete("/:id",
        tokenAuthMiddleware(),
        writeDevicePermissionMiddleware(),
        async (ctx) => {
            const result = await DeviceService.deleteById(ctx.params.id);
            if (!result) ctx.status = 404;

            ctx.status = 204;
            eventEmitter.emit('device_delete', ctx.params.id);
        })

    return api;
}

// export const a = () =>
//     resource({
//         middlewares: {
//             // index: [tokenAuthMIddleware()],
//             // read: [tokenAuthMIddleware(), checkReadPerm()],
//             // modifyId: [
//             //     tokenAuthMIddleware(),
//             //     checkWritePerm(),
//             //     formDataChecker(fieldDescriptors, { allowedForms: ['EDIT_DEVICE'] }),
//             // ],
//             // createId: [
//             //     tokenAuthMIddleware(),
//             //     checkWritePerm(),
//             //     formDataChecker(fieldDescriptors, { allowedForms: ['DEVICE_SEND'] })
//             // ],
//             // deleteId: [tokenAuthMIddleware(), checkWritePerm()],
//         },

//         /** GET / - List all devices for which the user has permissions
//          * @header Authorization-JWT
//          * @return json device
//          */
//         async index({ user, query }: RequestWithAuth<{}, { filter: string }>, res) {
//             if (user.admin && query.filter === "all") {
//                 const docs = await DeviceModel.find({}).select("info permissions createdBy metadata").lean();
//                 res.send({ docs });
//                 return;
//             }

//             const docs = await DeviceModel.findForUser(user._id);
//             res.send({ docs });
//         },

//         /** GET /:id - Return device
//          * @header Authorization-JWT
//          * @return json { docs: IDevice[] }
//          */
//         async read({ user, params: { id } }: RequestId, res) {
//             const device = await DeviceModel.findById(id);
//             res.send(device);
//         },

//         /** POST /:id - Send command to provided device
//          * @restriction user needs write permission
//          * @header Authorization-JWT
//          * @body form DEVICE_SEND
//          */
//         async createId({ body, params, context }: RequestId, res) {
//             const { formData } = body;
//             const doc: IDevice = await DeviceModel.findById(params.id).lean();

//             if (formData.DEVICE_SEND && (await context.actionsService.deviceSendCommand(doc, formData.DEVICE_SEND.command)))
//                 return res.sendStatus(204);

//             res.sendStatus(400);
//         },

//         /** PATCH  /:id - Modify provided device
//          * @restriction user needs write permission
//          * @header Authorization-JWT
//          * @body form EDIT_DEVICE
//          */
//         async modifyId({ body, params: { id } }: RequestId, res) {
//             const { formData } = body;

//             const form = formData.EDIT_DEVICE;
//             await DeviceModel.updateByFormData(id, form);
//             res.sendStatus(204);
//         },

//         /** DELETE  /:id - Delete provided device + all associated notifications and history data
//          * @restriction user needs write permission
//          * @header Authorization-JWT
//          */
//         async deleteId({ params }: RequestId, res) {
//             const result = await DeviceService.deleteById(params.id);
//             if (result) res.sendStatus(204);
//             else res.sendStatus(404);
//             eventEmitter.emit('device_delete', params.id);
//         },
//     });
