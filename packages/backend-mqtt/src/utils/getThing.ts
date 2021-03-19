import { IDevice } from "common/lib/models/interface/device";
import { IThing } from "common/lib/models/interface/thing";

export function getThing(device: IDevice, nodeId: IThing["config"]["nodeId"]) {
	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
