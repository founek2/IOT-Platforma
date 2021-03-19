import resource from "framework/lib/middlewares/resource-router-middleware";
import tokenAuthMIddleware from "framework/lib/middlewares/tokenAuth";
import formDataChecker from "framework/lib/middlewares/formDataChecker";

import fieldDescriptors from "common/lib/fieldDescriptors";
import checkReadPerm from "../../middlewares/device/checkReadPerm";
import checkControlPerm from "../../middlewares/device/checkControlPerm";
import Notify from "../../models/Notification";
import { transformNotifyForBE } from "common/lib/utils/transform";
import { NotifyModel } from "common/lib/models/notifyModel";

function checkUpdate(req, res, next) {
	console.log(req.body);
	if (req.body.formData.EDIT_NOTIFY_SENSORS) return checkReadPerm()(req, res, next);
	else if (req.body.formData.EDIT_NOTIFY_CONTROL) return checkControlPerm()(req, res, next);

	res.status(208).send({ error: "InvalidParam" });
}

export default ({ config, db }) =>
	resource({
		mergeParams: true,

		middlewares: {
			update: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors)],
			index: [tokenAuthMIddleware()],
		},

		async index({ params, user }, res) {
			const { deviceId, nodeId } = params;

			console.log("index", params);

			const doc = await NotifyModel.getForThing(deviceId, nodeId, user.id);
			console.log("items", doc);
			res.send({
				doc: {
					thing: doc && doc.things ? doc.things[0] : { nodeId, properties: [] },
				},
			});
		},

		// PUT
		update({ params, body: { formData }, user }, res) {
			const { deviceId, nodeId } = params;
			console.log("params", params);
			if (formData.EDIT_NOTIFY) {
				const { properties } = transformNotifyForBE(formData.EDIT_NOTIFY);
				console.log("properties", properties);
				NotifyModel.setForThing(deviceId, nodeId, user.id, properties).then((doc) => {
					console.log("items", doc);
					res.send({
						doc: {
							things: doc && doc.things ? doc.things : [],
						},
					});
				});
			}
		},
	});
