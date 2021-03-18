import { Emitter, EmitterEvents } from "../services/eventEmitter";
import device from "./device";

export default function (eventEmitter: Emitter<EmitterEvents>) {
	device(eventEmitter);
}
