import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import { getProperty } from 'common/lib/utils/getProperty';
import { getThing } from 'common/lib/utils/getThing';
import checkRealmReadPerm from 'common/lib/middlewares/device/checkRealmReadPerm';
import { HasContext } from '../../types';

type Params = { realm: string; deviceId: string; nodeId: string, propertyId: string };
type RequestQuery = RequestWithAuth<Params, { property?: string; value?: string }>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            read: [tokenAuthMIddleware(), checkRealmReadPerm({ paramKey: 'deviceId' })],
        },

        async read({ params, context }: RequestQuery & HasContext, res) {
            const { realm, deviceId, nodeId, propertyId } = params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return res.sendStatus(404);

            const thing = getThing(doc, nodeId);
            if (!thing) return res.status(404).send("Thing not found");

            const property = getProperty(thing, propertyId);
            if (!property) return res.status(404).send("Property not found");

            const state = thing.state?.propertyId;

            res.send(state || {})
        },
    });
