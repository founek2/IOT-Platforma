import { logger } from 'common/lib/logger';
import { getProperty } from 'common/lib/utils/getProperty.js';
import { getThing } from 'common/lib/utils/getThing.js';
import { Emitter, EmitterEvents } from '../services/eventEmitter.js';
import { publishStr } from '../services/mqtt.js';

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
