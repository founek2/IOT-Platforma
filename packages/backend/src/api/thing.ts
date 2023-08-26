import { DeviceModel } from 'common/lib/models/deviceModel.js';
import { IDevice } from 'common/lib/models/interface/device.js';
import { RequestWithAuth } from 'common/lib/types.js';
import { getProperty } from 'common/lib/utils/getProperty.js';
import { getThing } from 'common/lib/utils/getThing.js';
import { validateValue } from 'common/lib/utils/validateValue.js';
import checkControlPerm from 'common/lib/middlewares/device/checkControlPerm.js';
import resource from 'common/lib/middlewares/resource-router-middleware.js';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth.js';
import { Actions } from '../services/actionsService.js';

type Params = { nodeId: string; deviceId: string };
type Request = RequestWithAuth<Params>;
type RequestQuery = RequestWithAuth<Params, { property?: string; value?: string }>;

/**
 * URL prefix /device/:deviceId/thing/:nodeId
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [tokenAuthMIddleware(), checkControlPerm({ paramKey: 'deviceId' })],
            modify: [tokenAuthMIddleware(), checkControlPerm({ paramKey: 'deviceId' })],
        },

        async index(req: Request, res) {
            res.send('Z bezpečnostích důvodů není metoda GET podporována. Použijte matodu POST.');
        },

        async create({ params, query }: RequestQuery, res) {
            const { deviceId, nodeId } = params;
            console.log('property', params, query);

            const doc: IDevice = await DeviceModel.findById(deviceId).lean();
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
