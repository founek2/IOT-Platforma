import fetch from "node-fetch";
import config from "../config";

export class Actions {
	public static async deviceInitPairing(deviceId: string, apiKey: string): Promise<boolean> {
		const res = await fetch(
			"http://localhost:" + config.portAuth + "/api/actions/device/" + deviceId + "/pairing/init",
			{
				method: "PUT",
				body: JSON.stringify({ apiKey }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		return res.status === 204;
	}
}
