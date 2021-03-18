import { JwtService } from "common/lib/services/jwtService";
import mongoose from "mongoose";
import { equals, T } from "ramda";
import { infoLog, warningLog } from "../logger";

import { enrichGroups } from "framework-ui/lib/privileges";

export default function (options = { restricted: true }) {
	return async (req, res, next) => {
		const { restricted, methods } = options;
		// if (req.url !== '/login') {
		if (methods === undefined || methods.some((method) => method === req.method)) {
			const token = req.get("Authorization-JWT");
			if (token) {
				try {
					const obj = await JwtService.verify(token);

					const days7_sec = 7 * 24 * 60 * 60;
					const now_sec = new Date().getTime() / 1000;

					if (obj.exp - now_sec < days7_sec) {
						infoLog("Resigning jwt token");
						const newToken = await JwtService.sign({ id: obj.id });
						res.set("Authorization-JWT-new", newToken);
					}
					req.user = obj;

					const user = await mongoose.model("User").findById(obj.id).exec();

					if (user) {
						infoLog(`Verified user=${user.info.userName}, groups=${user.groups.join(",")}`);
						req.user = user.toObject();
						req.user.groups = enrichGroups(req.user.groups);
						if (req.user.groups.some(equals("root"))) req.root = true;
						if (req.user.groups.some(equals("admin"))) req.user.admin = true;
						next();
					} else {
						warningLog("userDoesNotExist");
						res.status(208).send({ error: "userDoesNotExist", command: "logOut" });
					}
				} catch (err) {
					console.log("token problem", err);
					res.status(208).send({ error: "invalidToken" });
				}
			} else if (!restricted) {
				next();
			} else {
				res.status(208).send({ error: "tokenNotProvided" });
			}
		} else next();
	};
}
