import { BackendEmitter } from "../services/eventEmitter";
import user from "./user";
import device from "./device";
import Agenda from "agenda";
import { UserService } from "common/lib/services/userService";

export default function (eventEmitter: BackendEmitter, agenda: Agenda, userService: UserService) {
	user(eventEmitter, agenda, userService);
	device(eventEmitter, agenda);
}
