import { Server as serverIO } from 'socket.io';
import { DeviceStatus, IDevice } from 'common/src/models/interface/device';
import { DeviceModel } from 'common/src/models/deviceModel';
import { logger } from 'framework-ui/src/logger';
import { getThing } from 'common/src/utils/getThing';
import { getProperty } from 'common/src/utils/getProperty';
import { validateValue } from 'common/src/utils/validateValue';
import { HistoricalModel } from 'common/src/models/historyModel';
import * as FireBaseService from '../FireBase';
import { SocketUpdateThingState } from 'common/src/types';
import { uniq } from 'ramda';
import { InfluxService } from 'common/src/services/influxService';

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

        if (device) {
            uniq(Object.values(device.permissions).flat().map(String)).forEach((userId) =>
                io.to(userId).emit('device', {
                    _id: device._id,
                    state: {
                        status: device.state!.status,
                    },
                })
            );
        }
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
                    [`things.$.state.${propertyId}.value`]: result.value,
                    [`things.$.state.${propertyId}.timestamp`]: timestamp,
                },
            }
        ).exec();

        logger.debug('saving data', message.toString());

        sendToUsers(io, device, nodeId, propertyId, result.value, timestamp);

        HistoricalModel.saveData(device._id, thing._id, propertyId, result.value, timestamp);
        FireBaseService.processData(device, nodeId, propertyId, result.value);

        const sample = InfluxService.createMeasurement(
            device._id.toString(),
            device.info.name,
            thing.config.nodeId,
            property,
            { value: result.value, timestamp }
        );
        InfluxService.saveMeasurement(sample);
    });
}

/**
 * Send real-time update to all users with read permission
 */
function sendToUsers(
    io: serverIO,
    device: IDevice,
    nodeId: string,
    propertyId: string,
    newValue: string | number,
    timestamp: Date
) {
    let thing = getThing(device, nodeId);

    const updateData: SocketUpdateThingState = {
        _id: device._id,
        thing: {
            _id: thing._id,
            nodeId: nodeId,
            state: { [propertyId]: { value: newValue, timestamp } },
        },
    };
    device.permissions['read'].forEach((userId) => {
        io.to(userId.toString()).emit('control', updateData);
    });
}
