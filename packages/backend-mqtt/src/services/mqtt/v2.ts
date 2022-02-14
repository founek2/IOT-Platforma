import { Server as serverIO } from 'socket.io';
import { DeviceStatus, IDevice } from 'common/lib/models/interface/device';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { logger } from 'framework-ui/lib/logger';
import { getThing } from 'common/lib/utils/getThing';
import { getProperty } from 'common/lib/utils/getProperty';
import { validateValue } from 'common/lib/utils/validateValue';
import { HistoricalModel } from 'common/lib/models/historyModel';
import * as FireBaseService from '../FireBase';
import { SocketUpdateThingState } from 'common/lib/types';
import { uniq } from 'ramda';

type cbFn = (topic: string, message: any, groups: string[]) => void;
export default function (handle: (stringTemplate: string, fn: cbFn) => void, io: serverIO) {
    handle('v2/+/+/$state', async function (topic, data, [realm, deviceId]) {
        const message: DeviceStatus = data.toString();
        logger.debug('got', message, realm, deviceId);
        const device = await DeviceModel.findOneAndUpdate(
            {
                'metadata.deviceId': deviceId,
                'metadata.realm': realm,
            },
            {
                'state.status.value': message,
                'state.status.timestamp': new Date(),
            },
            { new: true }
        )
            .lean()
            .exec();

        if (device)
            uniq(Object.values(device.permissions).flat().map(String)).forEach((userId) =>
                io.to(userId).emit('device', {
                    _id: device._id,
                    state: {
                        status: device.state!.status,
                    },
                })
            );
    });

    handle('v2/+/+/+/+', async function (topic, message, [realm, deviceId, nodeId, propertyId]) {
        const timestamp = new Date();

        const device = await DeviceModel.findOne({
            'metadata.deviceId': deviceId,
            'metadata.realm': realm,
            'things.config.nodeId': nodeId,
            'things.config.properties.propertyId': propertyId,
        })
            .lean()
            .exec();
        if (!device) return logger.warning('mqtt - Got data from invalid/misconfigured device');

        const thing = getThing(device, nodeId);
        const property = getProperty(thing, propertyId);
        const result = validateValue(property, message.toString());
        if (!result.valid) return logger.debug('mqtt - Got invalid data');

        DeviceModel.updateOne(
            {
                _id: device._id,
                'things.config.nodeId': nodeId,
            },
            {
                $set: {
                    'things.$.state.timestamp': timestamp,
                    [`things.$.state.value.${propertyId}`]: result.value,
                },
            }
        ).exec();

        logger.debug('saving data', message.toString());

        sendToUsers(io, device, nodeId, propertyId, result.value);

        HistoricalModel.saveData(device._id, thing._id, propertyId, result.value, timestamp);
        FireBaseService.processData(device, nodeId, propertyId, result.value);
    });
}

/**
 * Send real-time update to all users with read permission
 */
function sendToUsers(io: serverIO, device: IDevice, nodeId: string, propertyId: string, newValue: string | number) {
    let thing = getThing(device, nodeId);
    if (thing.state) thing.state.value[propertyId] = newValue;
    else thing.state = { timestamp: new Date(), value: { [propertyId]: newValue } };

    const updateData: SocketUpdateThingState = {
        _id: device._id,
        thing: {
            nodeId: thing.config.nodeId,
            state: thing.state,
        },
    };
    device.permissions['read'].forEach((userId) => {
        io.to(userId.toString()).emit('control', updateData);
    });
}
