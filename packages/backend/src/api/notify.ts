import fieldDescriptors from 'common/lib/fieldDescriptors';
import { NotifyModel } from 'common/lib/models/notifyModel';
import { RequestWithAuth } from 'common/lib/types';
import { transformNotifyForBE } from 'common/lib/utils/transform';
import checkReadPerm from 'common/lib/middlewares/device/checkReadPerm';
import checkWritePerm from 'common/lib/middlewares/device/checkWritePerm';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';

type Params = { nodeId: string; deviceId: string };
type Request = RequestWithAuth<Params>;
type RequestId = RequestWithAuth<Params & { id: string }>;

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
        async index({ params, user }: Request, res) {
            const { deviceId, nodeId } = params;
            if (!deviceId || !nodeId) return res.sendStatus(400);

            const doc = await NotifyModel.getForThing(deviceId, nodeId, user._id);
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
        async replace({ params, body: { formData }, user }: Request, res) {
            const { deviceId, nodeId } = params;

            if (formData.EDIT_NOTIFY) {
                const { properties } = transformNotifyForBE(formData.EDIT_NOTIFY);

                await NotifyModel.setForThing(deviceId, nodeId, user._id, properties);
                res.sendStatus(204);
            } else res.sendStatus(400);
        },
    });
