import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import { getThing } from 'common/lib/utils/getThing';
import checkRealmReadPerm from 'common/lib/middlewares/device/checkRealmReadPerm';

type Params = { realm: string; deviceId: string; nodeId: string };
type RequestQuery = RequestWithAuth<Params, { property?: string; value?: string }>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId/state
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            index: [tokenAuthMIddleware(), checkRealmReadPerm({ paramKey: 'deviceId' })],
        },

        async index({ params, query }: RequestQuery, res) {
            const { realm, deviceId, nodeId } = params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return res.sendStatus(404);

            const thing = getThing(doc, nodeId);
            if (!thing) return res.status(404).send("Thing not found");

            res.send(thing.state || {})
        },
    });
