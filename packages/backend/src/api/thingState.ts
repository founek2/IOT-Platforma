import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import { getThing } from 'common/lib/utils/getThing';
import checkReadPerm from 'common/lib/middlewares/device/checkReadPerm';

type Params = { deviceId: string; nodeId: string };
type Request = RequestWithAuth<Params>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId/state
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            index: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })],
        },

        async index({ params: { deviceId, nodeId } }: Request, res) {
            const device = await DeviceModel.findById(deviceId);
            const thing = getThing(device!, nodeId);
            if (!thing) return res.sendStatus(404);

            return thing.state;
        },
    });
