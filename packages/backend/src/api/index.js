// import { version } from '../../../../package.json'
import { Router } from "express";
import user from "./user";
import device from "./device";
import auth from "./auth";
import notify from "./notify";
import discovery from "./discovery";
import history from "./history";
import thing from "./thing";

export default ({ config }) => {
	let api = Router();
	// mount the user resource
	api.use("/user", user({ config }));

	api.use("/device/:deviceId/thing/:nodeId/notify", notify({ config }));

	api.use("/device", device({ config }));

	api.use("/device/:deviceId/thing/:thingId/history", history({ config }));

	api.use("/device/:deviceId/thing/:thingId", thing({ config }));

	api.use("/discovery", discovery({ config }));

	api.use("/auth", auth({ config }));

	// perhaps expose some API metadata at the root
	api.get("/", (req, res) => {
		res.json({ version: 0.1 });
	});

	return api;
};
