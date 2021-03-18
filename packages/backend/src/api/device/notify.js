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
			update: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors), checkUpdate],
			index: [tokenAuthMIddleware()],
		},

		index({ params, user }, res) {
			const { deviceId, nodeId } = params;

			console.log("index", params);

			NotifyModel.getForThing(deviceId, nodeId, user.id).then((doc) => {
				console.log("items", doc);
				res.send({
					doc: {
						things: doc && doc.things ? doc.things : [],
					},
				});
			});
		},

		// PUT
		update({ params: { id }, body: { formData }, user }, res) {
			if (formData.EDIT_NOTIFY_SENSORS) {
				const { sensors } = transformNotifyForBE(formData.EDIT_NOTIFY_SENSORS);
				Notify.addOrUpdateSensors(user.id, id, sensors)
					.then((result) => {
						res.sendStatus(204);
					})
					.catch((e) => {
						console.log("err", e);
						res.sendStatus(500);
					});
			} else if (formData.EDIT_NOTIFY_CONTROL) {
				const { sensors, key } = transformNotifyForBE(formData.EDIT_NOTIFY_CONTROL);
				console.log("transformed", transformNotifyForBE(formData.EDIT_NOTIFY_CONTROL));
				Notify.addOrUpdateControl(user.id, id, key, sensors)
					.then((result) => {
						res.sendStatus(204);
					})
					.catch((e) => {
						console.log("err", e);
						res.sendStatus(500);
					});
			} else res.sendStatus(400);
		},
	});
