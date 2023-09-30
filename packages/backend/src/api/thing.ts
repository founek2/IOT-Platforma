import { DeviceModel } from 'common/lib/models/deviceModel';
import { IDevice } from 'common/lib/models/interface/device';
import { RequestWithAuth } from 'common/lib/types';
import { getProperty } from 'common/lib/utils/getProperty';
import { getThing } from 'common/lib/utils/getThing';
import { validateValue } from 'common/lib/utils/validateValue';
import checkControlPerm from 'common/lib/middlewares/device/checkControlPerm';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import { ObjectId } from '../utils/objectId';
import checkWritePerm from 'common/lib/middlewares/device/checkWritePerm';

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
            replace: [tokenAuthMIddleware(), checkWritePerm({ paramKey: 'deviceId' })],
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
            const result = validateValue(property, Buffer.from(value));
            if (!result.valid) return res.sendStatus(400);

            (await Actions.deviceSetProperty(deviceId, nodeId, propertyId, value, doc))
                ? res.sendStatus(204)
                : res.sendStatus(400);
        },

        async replace({ params: { deviceId, nodeId }, body }: Request, res) {
            const { formData } = body;
            const config = formData.EDIT_THING.config;

            const device = await DeviceModel.findById(deviceId);
            if (!device) return res.sendStatus(404);

            await DeviceModel.updateOne({
                _id: ObjectId(deviceId),
                "things._id": ObjectId(nodeId),
            }, {
                "things.$.config": config,
            })

            res.sendStatus(204)
        },
    });
