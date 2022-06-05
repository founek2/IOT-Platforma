import { IDevice } from 'common/src/models/interface/device';
import { normalize, schema } from 'normalizr';
import { Device } from '../store/reducers/application/devices';
import { Thing } from '../store/reducers/application/things';

const thingEntity = new schema.Entity(
    'things',
    {},
    {
        idAttribute: '_id',
    }
);

const deviceEntity = new schema.Entity(
    'devices',
    {
        things: [thingEntity],
    },
    {
        idAttribute: '_id',
    }
);

export function normalizeDevices(devices: IDevice[]) {
    return normalize(devices, [deviceEntity]);
}

export function normalizeDevice(device: IDevice) {
    const results = normalize(device, deviceEntity);
    const deviceId = results.result;
    const normalizedDevice: Device = results.entities.devices![deviceId];
    const things: { [key: string]: Thing } = results.entities.things!;

    return { device: normalizedDevice, things };
}
