import fieldDescriptors from 'common/src/fieldDescriptors';
import { DeviceModel } from 'common/src/models/deviceModel';
import checkWritePerm from 'common/src/middlewares/device/checkWritePerm';
import formDataChecker from 'common/src/middlewares/formDataChecker';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import { DeviceService } from '../services/deviceService';
import eventEmitter from '../services/eventEmitter';
import { IDevice } from 'common/src/models/interface/device';
import { RequestWithAuth } from 'common/src/types';
import checkReadPerm from '../middlewares/device/checkReadPerm';

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
