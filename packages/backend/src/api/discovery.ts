import resource from "framework/lib/middlewares/resource-router-middleware";
import Device from "../models/Device";
import processError from "framework/lib/utils/processError";
import { saveImageBase64, validateFileExtension, deleteImage } from "../service/files";
import { transformSensorsForBE, transformControlForBE } from "common/lib/utils/transform";
import tokenAuthMIddleware from "framework/lib/middlewares/tokenAuth";
import formDataChecker from "framework/lib/middlewares/formDataChecker";

import fieldDescriptors from "common/lib/fieldDescriptors";
import checkReadPerm from "../middleware/device/checkReadPerm";
import checkWritePerm from "../middleware/device/checkWritePerm";
import checkControlPerm from "../middleware/device/checkControlPerm";
import Notify from "../models/Notification";
import { handleMapping } from "common/lib/service/DeviceHandler";
import { contains, __, flip, filter, o, prop } from "ramda";
import eventEmitter from "../service/eventEmitter";
import agenda from "../agenda";
import { DeviceDiscovery } from "common/lib/models/deviceDiscoveryModel";
import { DeviceModel } from "common/lib/models/deviceModel";
import mongoose from "mongoose";
import { Actions } from "../service/actions";

const ObjectId = mongoose.Types.ObjectId;

function checkRead(req: any, res: any, next: any) {
	if (req.query.type === "sensors") return checkReadPerm()(req, res, next);

	if (req.query.type === "control") return checkControlPerm()(req, res, next);

	if (req.query.type === "apiKey") return checkWritePerm()(req, res, next);
	res.status(208).send({ error: "InvalidParam" });
}

// TODO - iot library -> on reconnect device doesnt send actual status
// TODO - api /device just for single device manipulation
export default () =>
	resource({
		middlewares: {
			index: [tokenAuthMIddleware()],
			delete: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors)],
			create: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors)],
		},

		/** GET / - List all entities */
		async index({ user, root }: any, res: any) {
			console.log("user - ", user.info.userName);
			const docs = await DeviceDiscovery.find({ userName: user.info.userName });

			res.send({ docs });
		},

		async delete({ body, user }: any, res: any) {
			// TODO check permission
			const selected = body.formData.DISCOVERY_DEVICES.selected;
			const result = await DeviceDiscovery.deleteMany({
				_id: { $in: selected.map(ObjectId) },
			});
			console.log("deleted", result);
			eventEmitter.emit("devices_delete", selected);
			res.sendStatus(204);
		},

		/** POST / - Create a new entity */
		async create({ body, user }: any, res: any) {
			// TODO permission check
			const { formData } = body;

			if (formData.CREATE_DEVICE) {
				const form = formData.CREATE_DEVICE;

				const doc = await DeviceDiscovery.findOne({ _id: ObjectId(form._id) });
				if (!doc) return res.status(208).send({ error: "deviceNotFound" });

				console.log("user is", user);
				const newDevice = await DeviceModel.createNew(
					{
						info: { ...form.info },
						things: doc.things,
						metadata: {
							topicPrefix: doc.userName,
							deviceId: doc.deviceId,
						},
					},
					user.id
				);

				const suuccess = await Actions.deviceInitPairing(doc.deviceId, newDevice.apiKey);
				if (suuccess) {
					doc.pairing = true;
					doc.save();
					res.send({ doc: newDevice });
				} else {
					newDevice.remove();
					res.setStatus(500);
				}
			} else res.sendStatus(500);
		},
	});
