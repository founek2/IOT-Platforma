import fieldDescriptors from 'common/src/fieldDescriptors';
import { DeviceModel } from 'common/src/models/deviceModel';
import checkWritePerm from '../middlewares/device/checkWritePerm';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import { DeviceService } from '../services/deviceService';
import eventEmitter from '../services/eventEmitter';
import { IDevice } from 'common/src/models/interface/device';

/**
 * URL prefix /device
 */
export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
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
         * @return json { docs: IDevice[] }
         */
        async index({ user }: any, res) {
            const docs = await DeviceModel.findForUser(user.id);
            res.send({ docs });
        },

        /** POST /:id - Send command to provided device
         * @restriction user needs write permission
         * @header Authorization-JWT
         * @body form DEVICE_SEND
         */
        async createId({ body, params }, res) {
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
        async modifyId({ body, params: { id } }, res) {
            const { formData } = body;

            const form = formData.EDIT_DEVICE;
            await DeviceModel.updateByFormData(id, form);
            res.sendStatus(204);
        },

        /** DELETE  /:id - Delete provided device + all associated notifications and history data
         * @restriction user needs write permission
         * @header Authorization-JWT
         */
        async deleteId({ params }, res) {
            const result = await DeviceService.deleteById(params.id);
            if (result) res.sendStatus(204);
            else res.sendStatus(404);
            eventEmitter.emit('device_delete', params.id);
        },
    });
