import { Server as serverIO } from 'socket.io';
import { DeviceStatus, IDevice } from 'common/lib/models/interface/device';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { logger } from 'common/lib/logger';
import { getThing } from 'common/lib/utils/getThing';
import { getProperty } from 'common/lib/utils/getProperty';
import { validateValue } from 'common/lib/utils/validateValue';
import { HistoricalModel } from 'common/lib/models/historyModel';
import { SocketUpdateThingState } from 'common/lib/types';
import { uniq } from 'ramda';
import { InfluxService } from 'common/lib/services/influxService';
import { NotificationService } from '../NotificationService';

type cbFn = (topic: string, message: Buffer, groups: string[]) => void;
export default function (handle: (stringTemplate: string, fn: cbFn) => void, io: serverIO, notificationService: NotificationService) {
    handle('v2/+/+/$state', async function (topic, data, [realm, deviceId]) {
        // TODO add validation
        const status = data.toString() as DeviceStatus;
        const timestamp = new Date();
        logger.debug('got', status, realm, deviceId);
        const device = await DeviceModel.findOneAndUpdate(
            {
                'metadata.deviceId': deviceId,
                'metadata.realm': realm,
            },
            {
                'state.status.value': status,
                'state.status.timestamp': timestamp,
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

            const sample = InfluxService.createDeviceStateMeasurement(device._id.toString(), device.info.name, {
                value: status,
                timestamp,
            });
            InfluxService.saveMeasurement(sample);
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
        const result = validateValue(property, message);
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
        notificationService.processData(device, nodeId, propertyId, result.value);

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
