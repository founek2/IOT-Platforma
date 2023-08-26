import { Emitter } from "../services/eventEmitter.js";
import * as types from "../types/index.js";
import user from "./user.js";
import device from "./device.js";

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
	user(eventEmitter);
	device(eventEmitter);
}
