import agenda from "../agenda";
import { Emitter, EmitterEvents } from "../service/eventEmitter";
import * as types from "../types";
import { AGENDA_JOB_TYPE } from "common/lib/constants/agenda";
import { publishStr } from "../service/mqtt";

export default function (eventEmitter: Emitter<EmitterEvents>) {
	eventEmitter.on("device_pairing_init", async ({ apiKey, deviceId }) => {
		publishStr(`prefix/${deviceId}/$config/apiKey/set`, apiKey);
	});

	eventEmitter.on("device_pairing_done", async (deviceId) => {});

	eventEmitter.on("device_set_state", ({ device, state }) => {
		console.log("state to change", device.things[0]._id, device.things[0].config, state);
		Object.entries(state).forEach(([propertyId, value]) => {
			publishStr(
				`v2/${device.metadata.realm}/${device.metadata.deviceId}/${device.things[0].config.nodeId}/${propertyId}/set`,
				String(value)
			);
		});
	});
}
