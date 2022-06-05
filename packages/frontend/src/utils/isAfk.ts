import { DeviceStatus } from 'common/src/models/interface/device';

export default function isAfk(status?: DeviceStatus) {
    return !(status && (status === DeviceStatus.ready || status === DeviceStatus.alert));
}
