import { DeviceStatus } from "common/lib/models/interface/device";

export default function isAfk(status?: DeviceStatus) {
    return !(status && (status === DeviceStatus.ready || status === DeviceStatus.alert));
}
