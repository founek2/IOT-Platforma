import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { DeviceModel } from 'common/src/models/deviceModel';
import { RequestWithAuth } from 'common/src/types';
import { getThing } from 'common/src/utils/getThing';
import checkReadPerm from 'common/src/middlewares/device/checkReadPerm';

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
