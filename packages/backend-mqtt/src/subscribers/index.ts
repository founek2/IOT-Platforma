import { Emitter, EmitterEvents } from "../services/eventEmitter.js";
import device from "./device.js";

export default function (eventEmitter: Emitter<EmitterEvents>) {
	device(eventEmitter);
}
