import agenda from "../agenda";
import { Emitter, EmitterEvents } from "../service/eventEmitter";
import * as types from "../types";
import { AGENDA_JOB_TYPE } from "common/lib/constants/agenda";
import { publish } from "../service/mqtt";

export default function (eventEmitter: Emitter<EmitterEvents>) {
	eventEmitter.on("device_pairing_init", async ({ apiKey, deviceId }) => {
		publish(`prefix/${deviceId}/$apiKey/set`, apiKey);
	});

	eventEmitter.on("device_pairing_done", async (deviceId) => {});
}
