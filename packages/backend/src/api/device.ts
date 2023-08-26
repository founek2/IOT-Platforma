import fieldDescriptors from 'common/lib/fieldDescriptors.js';
import { DeviceModel } from 'common/lib/models/deviceModel.js';
import checkWritePerm from 'common/lib/middlewares/device/checkWritePerm.js';
import formDataChecker from 'common/lib/middlewares/formDataChecker.js';
import resource from 'common/lib/middlewares/resource-router-middleware.js';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth.js';
import { Actions } from '../services/actionsService.js';
import { DeviceService } from '../services/deviceService.js';
import eventEmitter from '../services/eventEmitter.js';
import { IDevice } from 'common/lib/models/interface/device.js';
import { RequestWithAuth } from 'common/lib/types.js';
import checkReadPerm from 'common/lib/middlewares/device/checkReadPerm.js';

type Request = RequestWithAuth;
type RequestId = RequestWithAuth & { params: { id: string } };

/**
 * URL prefix /device
 */
export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            read: [tokenAuthMIddleware(), checkReadPerm()],
            modifyId: [
                tokenAuthMIddleware(),
                checkWritePerm(),
                formDataChecker(fieldDescriptors, { allowedForms: ['EDIT_DEVICE'] }),
            ],
            createId: [tokenAuthMIddleware(), checkWritePerm()],
            deleteId: [tokenAuthMIddleware(), checkWritePerm()],
        },

        /** GET / - List all devices for which the user has permissions
         * @header Authorization-JWT
         * @return json device
         */
        async index({ user }: Request, res) {
            const docs = await DeviceModel.findForUser(user._id);
            res.send({ docs });
        },

        /** GET /:id - Return device
         * @header Authorization-JWT
         * @return json { docs: IDevice[] }
         */
        async read({ user, params: { id } }: RequestId, res) {
            const device = await DeviceModel.findById(id);
            res.send(device);
        },

        /** POST /:id - Send command to provided device
         * @restriction user needs write permission
         * @header Authorization-JWT
         * @body form DEVICE_SEND
         */
        async createId({ body, params }: RequestId, res) {
            const { formData } = body;
            const doc: IDevice = await DeviceModel.findById(params.id).lean();

            if (formData.DEVICE_SEND && (await Actions.deviceSendCommand(doc, formData.DEVICE_SEND.command)))
                return res.sendStatus(204);
            res.sendStatus(500);
        },

        /** PATCH  /:id - Modify provided device
         * @restriction user needs write permission
         * @header Authorization-JWT
         * @body form EDIT_DEVICE
         */
        async modifyId({ body, params: { id } }: RequestId, res) {
            const { formData } = body;

            const form = formData.EDIT_DEVICE;
            await DeviceModel.updateByFormData(id, form);
            res.sendStatus(204);
        },

        /** DELETE  /:id - Delete provided device + all associated notifications and history data
         * @restriction user needs write permission
         * @header Authorization-JWT
         */
        async deleteId({ params }: RequestId, res) {
            const result = await DeviceService.deleteById(params.id);
            if (result) res.sendStatus(204);
            else res.sendStatus(404);
            eventEmitter.emit('device_delete', params.id);
        },
    });
