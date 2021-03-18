import agenda from "../agenda";
import { Emitter } from "../services/eventEmitter";
import * as types from "../types";
import { AGENDA_JOB_TYPE } from "common/lib/constants/agenda";

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
	eventEmitter.on("user_login", async (user) => {
		console.log("user_login", { user });
	});

	eventEmitter.on("user_signup", async (user: types.UserBasic) => {
		if (user.info.email) agenda.now(AGENDA_JOB_TYPE.SIGN_UP_EMAIL, { user });
	});
}
