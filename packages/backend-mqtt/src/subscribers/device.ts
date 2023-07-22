import { logger } from 'common/src/logger';
import { getProperty } from 'common/src/utils/getProperty';
import { getThing } from 'common/src/utils/getThing';
import { Emitter, EmitterEvents } from '../services/eventEmitter';
import { publishStr } from '../services/mqtt';

export default function (eventEmitter: Emitter<EmitterEvents>) {
    eventEmitter.on('device_pairing_init', async ({ apiKey, deviceId }) => {
        publishStr(`prefix/${deviceId}/$config/apiKey/set`, apiKey);
    });

    eventEmitter.on('device_pairing_done', async (deviceId) => { });

    eventEmitter.on('device_set_state', ({ device, value, nodeId, propertyId }) => {
        logger.debug('state to change', value);
        const thing = getThing(device, nodeId);
        const property = getProperty(thing, propertyId);

        publishStr(
            `v2/${device.metadata.realm}/${device.metadata.deviceId}/${nodeId}/${propertyId}/set`,
            String(value),
            { retain: Boolean(property.retained) }
        );
    });

    eventEmitter.on('device_send_command', ({ device, command }) => {
        logger.debug('command to send', command);

        publishStr(`v2/${device.metadata.realm}/${device.metadata.deviceId}/$cmd/set`, command);
    });
}
