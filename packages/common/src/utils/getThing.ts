import type { IDevice } from "../models/interface/device.js";
import type { IThing } from "../models/interface/thing.js";

export function getThing(device: IDevice, nodeId: IThing["config"]["nodeId"]) {
	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
