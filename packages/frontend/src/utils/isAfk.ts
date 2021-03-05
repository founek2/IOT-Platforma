import { DeviceStatus } from "common/lib/models/interface/device";

export default function isAfk(status: DeviceStatus) {
	return !(status === DeviceStatus.Ready || status === DeviceStatus.Alert);
}
