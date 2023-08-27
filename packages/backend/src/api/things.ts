import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import checkControlPerm from 'common/lib/middlewares/device/checkControlPerm';
import { ObjectId } from '../utils/objectId';

type Params = { deviceId: string };
type Request = RequestWithAuth<Params>;

/**
 * URL prefix /device/:deviceId/thing
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            replace: [tokenAuthMIddleware(), checkControlPerm({ paramKey: 'deviceId' })],
        },

        async replace({ params: { deviceId }, body }: Request, res) {
            const { formData } = body;
            const things = formData.EDIT_DEVICE_CONFIG.things;
            const device = await DeviceModel.findById(deviceId);
            if (!device) return res.sendStatus(404);

            await DeviceModel.updateOne({ _id: ObjectId(deviceId) }, { things });

            res.status(204)
        },
    });
