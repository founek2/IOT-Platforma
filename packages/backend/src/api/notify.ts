import fieldDescriptors from 'common/lib/fieldDescriptors';
import { NotifyModel } from 'common/lib/models/notifyModel';
import { transformNotifyForBE } from 'common/lib/utils/transform';
import checkReadPerm from '../middlewares/device/checkReadPerm';
import checkWritePerm from '../middlewares/device/checkWritePerm';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';

export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            replace: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'deviceId' }),
                formDataChecker(fieldDescriptors)
            ],
            index: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })]
        },

        async index({ params, user }: any, res) {
            const { deviceId, nodeId } = params;
            if (!deviceId || !nodeId) return res.sendStatus(400)

            const doc = await NotifyModel.getForThing(deviceId, nodeId, user.id);
            res.send({
                doc: {
                    thing: doc && doc.things ? doc.things[0] : { nodeId, properties: [] }
                }
            });
        },

        // PUT
        async replace({ params, body: { formData }, user }: any, res) {
            const { deviceId, nodeId } = params;
            console.log('params', params);
            if (formData.EDIT_NOTIFY) {
                const { properties } = transformNotifyForBE(formData.EDIT_NOTIFY);

                await NotifyModel.setForThing(deviceId, nodeId, user.id, properties)
                res.sendStatus(204)
            } else res.sendStatus(400)
        }
    });
