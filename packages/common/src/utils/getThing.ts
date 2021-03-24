import type { IDevice } from "../models/interface/device";
import type { IThing } from "../models/interface/thing";

export function getThing(device: IDevice, nodeId: IThing["config"]["nodeId"]) {
	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
