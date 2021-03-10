import fetch from "node-fetch";
import * as types from "../../types";
import { MUSIC_CAST_INPUT } from "../../constants";

class MusicCastService {
	url: string = "";
	constructor(ipAddress: string) {
		this.url = "http://" + ipAddress;
	}

	// async powerOff() {
	//     const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=standby")
	//     return res.status === 200
	// }

	// async powerOn() {
	//     const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=on")
	//     return res.status === 200
	// }

	async setInput(input: MUSIC_CAST_INPUT) {
		const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setInput?input=" + input);
		return res.status === 200;
	}

	async powerToggle() {
		const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=toggle");
		return res.status === 200;
	}

	async isOnline(): Promise<boolean> {
		const res = await fetch(this.url + "/YamahaExtendedControl/v1/system/getDeviceInfo");
		return res.status === 200;
	}
}

interface FormChange {
	state: {
		on: number;
		input: MUSIC_CAST_INPUT;
	};
}
export const changeMusicCast: types.ChangeHandler<FormChange> = async (
	{ JSONkey, state: { on, input } },
	current,
	recipe: types.ControlRecipe
) => {
	const service = new MusicCastService(recipe.ipAddress as string);
	if (on === 1 && (await service.powerToggle())) return { on };
	else if (input && (await service.setInput(input))) return { input };

	return false;
};

export const isOnlineMusicCast: types.AckHandler = async (recipe) => {
	const service = new MusicCastService(recipe.ipAddress as string);
	return service.isOnline();
};
