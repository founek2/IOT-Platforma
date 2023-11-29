import { Emitter, EmitterEvents } from "../services/eventEmitter";
import { MqttService } from "../services/mqtt";
import device from "./device";

export default function (eventEmitter: Emitter<EmitterEvents>, mqttService: MqttService) {
	device(eventEmitter, mqttService);
}
