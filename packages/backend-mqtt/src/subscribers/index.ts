import { Emitter, EmitterEvents } from "../service/eventEmitter";
import device from "./device";

export default function (eventEmitter: Emitter<EmitterEvents>) {
	device(eventEmitter);
}
