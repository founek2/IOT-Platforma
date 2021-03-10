import resource from "framework/lib/middlewares/resource-router-middleware";
import Device from "../../models/Device";
import processError from "framework/lib/utils/processError";
import { saveImageBase64, validateFileExtension, deleteImage } from "../../service/files";
import { transformSensorsForBE, transformControlForBE } from "common/lib/utils/transform";
import tokenAuthMIddleware from "framework/lib/middlewares/tokenAuth";
import formDataChecker from "framework/lib/middlewares/formDataChecker";

import fieldDescriptors from "common/lib/fieldDescriptors";
import checkReadPerm from "../../middleware/device/checkReadPerm";
import checkWritePerm from "../../middleware/device/checkWritePerm";
import checkControlPerm from "../../middleware/device/checkControlPerm";
import Notify from "../../models/Notification";
import { handleMapping } from "common/lib/service/DeviceHandler";
import { contains, __, flip, filter, o, prop } from "ramda";
import eventEmitter from "../../service/eventEmitter";
import agenda from "../../agenda";
import { HistoricalModel } from "common/lib/models/historyModel";
import mongoose from "mongoose";
import express from "express";

export default ({ config, db }: any) =>
	resource({
		mergeParams: true,
		middlewares: {
			read: [tokenAuthMIddleware()],
		},
		/** GET /:param - List all entities */
		async index({ params, query: { from, to }, user }: any, res: express.Response) {
			const { deviceId, thingId } = params;
			console.log("par", params);
			const docs = await HistoricalModel.getData(
				deviceId,
				thingId,
				new Date(Number(from)),
				new Date(to ? Number(to) : new Date())
			);
			res.send({ docs });
		},
	});
