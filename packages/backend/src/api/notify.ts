import fieldDescriptors from '@common/fieldDescriptors';
import { NotifyModel } from '@common/models/notifyModel';
import { transformNotifyForBE } from '@common/utils/transform';
import checkReadPerm from '../middlewares/device/checkReadPerm';
import checkWritePerm from '../middlewares/device/checkWritePerm';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';

/**
 * URL prefix /device/:deviceId/thing/:nodeId/notify
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            replace: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'deviceId' }),
                formDataChecker(fieldDescriptors),
            ],
            index: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })],
        },

        /** GET / - List all notification rules associated with provided thing of device
         * @restriction user needs read permission
         * @header Authorization-JWT
         * @return json { doc: { thing: INotifyThing[] } }
         */
        async index({ params, user }: any, res) {
            const { deviceId, nodeId } = params;
            if (!deviceId || !nodeId) return res.sendStatus(400);

            const doc = await NotifyModel.getForThing(deviceId, nodeId, user.id);
            res.send({
                doc: {
                    thing: doc && doc.things ? doc.things[0] : { nodeId, properties: [] },
                },
            });
        },

        /** PUT / - Replace all notification rules associated with provided thing of device
         * @restriction user needs read permission
         * @header Authorization-JWT
         * @body form EDIT_NOTIFY
         */
        async replace({ params, body: { formData }, user }: any, res) {
            const { deviceId, nodeId } = params;

            if (formData.EDIT_NOTIFY) {
                const { properties } = transformNotifyForBE(formData.EDIT_NOTIFY);

                await NotifyModel.setForThing(deviceId, nodeId, user.id, properties);
                res.sendStatus(204);
            } else res.sendStatus(400);
        },
    });
