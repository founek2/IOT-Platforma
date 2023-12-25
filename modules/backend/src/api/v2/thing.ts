import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { RequestWithAuth } from 'common/lib/types';
import { getProperty } from 'common/lib/utils/getProperty';
import { getThing } from 'common/lib/utils/getThing';
import { validateValue } from 'common/lib/utils/validateValue';
import checkRealmControlPerm from 'common/lib/middlewares/device/checkRealmControlPerm';
import { HasContext } from '../../types';
import checkRealmReadPerm from 'common/lib/middlewares/device/checkRealmReadPerm';

type Params = { realm: string; deviceId: string; nodeId: string };
type Request = RequestWithAuth<Params>;
type RequestQuery = RequestWithAuth<Params, { property?: string; value?: string }>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [tokenAuthMIddleware(), checkRealmControlPerm({ paramKey: 'deviceId' })],
            index: [tokenAuthMIddleware(), checkRealmReadPerm({ paramKey: 'deviceId' })],
        },

        async index(req: Request, res) {
            return res.send('Z bezpečnostích důvodů není metoda GET podporována. Použijte matodu POST pro ovládání nebo odeberte query parametry z url.');
        },

        async create({ params, query, context }: RequestQuery & HasContext, res) {
            const { realm, deviceId, nodeId } = params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return res.sendStatus(404);

            const thing = getThing(doc, nodeId);

            const propertyId = query.property;
            const value = query.value;

            if (!propertyId || !value) return res.sendStatus(400);

            const property = getProperty(thing, propertyId);
            const result = validateValue(property, Buffer.from(value));
            if (!result.valid) return res.sendStatus(400);

            (await context.actionsService.deviceSetProperty(deviceId, nodeId, propertyId, value, doc))
                ? res.sendStatus(200)
                : res.sendStatus(400);
        },
    });
