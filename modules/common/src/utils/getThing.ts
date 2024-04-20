import { INTERNAL_PROPERTY_STATE_ID, INTERNAL_THING_ID } from "../constants";
import type { IDevice } from "../models/interface/device";
import type { IThing } from "../models/interface/thing";
import { ComponentType, PropertyDataType } from "../models/interface/thing"

export function getThing(device: IDevice, nodeId: IThing["config"]["nodeId"]): IThing {
	if (nodeId === INTERNAL_THING_ID) {
		return {
			config: {
				name: 'Stav zařízení',
				nodeId,
				componentType: ComponentType.generic,
				properties: [
					{
						propertyId: INTERNAL_PROPERTY_STATE_ID,
						name: 'Stav',
						dataType: PropertyDataType.string,
						settable: false,
					}
				]
			}
		}
	}

	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
