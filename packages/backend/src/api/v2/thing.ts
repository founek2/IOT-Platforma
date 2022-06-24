import { DeviceModel } from 'common/src/models/deviceModel';
import { IDevice } from 'common/src/models/interface/device';
import { RequestWithAuth } from 'common/src/types';
import { getProperty } from 'common/src/utils/getProperty';
import { getThing } from 'common/src/utils/getThing';
import { validateValue } from 'common/src/utils/validateValue';
import { all, equals } from 'ramda';
import checkControlPerm from 'common/src/middlewares/device/checkControlPerm';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { Actions } from '../../services/actionsService';

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
            modify: [tokenAuthMIddleware()],
        },

        async index(req: Request, res) {
            res.send('Z bezpečnostích důvodů není metoda GET podporována. Použijte matodu POST.');
        },

        async create({ params, query }: RequestQuery, res) {
            const { realm, deviceId, nodeId } = params;

            const doc = await DeviceModel.findByRealm(realm, deviceId);
            if (!doc) return res.sendStatus(404);

            const thing = getThing(doc, nodeId);

            const propertyId = query.property;
            const value = query.value;

            if (!propertyId || !value) return res.sendStatus(400);

            const property = getProperty(thing, propertyId);
            const result = validateValue(property, value.toString());
            if (!result.valid) return res.sendStatus(400);

            (await Actions.deviceSetProperty(deviceId, nodeId, propertyId, value, doc))
                ? res.sendStatus(204)
                : res.sendStatus(400);
        },
    });
