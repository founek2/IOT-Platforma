import fieldDescriptors from 'common/lib/fieldDescriptors';
import { DeviceModel } from 'common/lib/models/deviceModel';
import checkWritePerm from '../middlewares/device/checkWritePerm';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import { DeviceService } from '../services/deviceService';
import eventEmitter from '../services/eventEmitter';
import { IDevice } from 'common/lib/models/interface/device';

export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            modifyId: [tokenAuthMIddleware(), checkWritePerm(), formDataChecker(fieldDescriptors, { allowedForms: ["EDIT_DEVICE"] })],
            createId: [tokenAuthMIddleware(), checkWritePerm()],
            deleteId: [tokenAuthMIddleware(), checkWritePerm()]
        },

        /** GET / - List all entities */
        async index({ user }: any, res) {
            const docs = await DeviceModel.findForUser(user.id);
            res.send({ docs });
        },

        /** POST / - Create a new entity */
        async createId({ body, params }, res) {
            const { formData } = body;
            const doc: IDevice = await DeviceModel.findById(params.id).lean();

            if (formData.DEVICE_SEND && (await Actions.deviceSendCommand(doc, formData.DEVICE_SEND.command)))
                return res.sendStatus(204);
            res.sendStatus(500);
        },

        /* PUT */
        async modifyId({ body, params: { id } }, res) {
            const { formData } = body;

            const form = formData.EDIT_DEVICE;
            await DeviceModel.updateByFormData(id, form);
            res.sendStatus(204);
        },

        async deleteId({ params }, res) {
            const result = await DeviceService.deleteById(params.id);
            if (result) res.sendStatus(204);
            else res.sendStatus(404);
            eventEmitter.emit('device_delete', params.id);
        }
    });
