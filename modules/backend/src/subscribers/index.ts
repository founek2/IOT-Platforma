import { Emitter } from "../services/eventEmitter";
import * as types from "../types";
import user from "./user";
import device from "./device";
import Agenda from "agenda";
import { UserService } from "common/lib/services/userService";

export default function (eventEmitter: Emitter<types.EmitterEvents>, agenda: Agenda, userService: UserService) {
	user(eventEmitter, agenda, userService);
	device(eventEmitter, agenda);
}
