import { DeviceModel } from "common/lib/models/deviceModel";
import express from "express";
import mongoose from "mongoose";

export default function (options: { paramKey: string } = { paramKey: "id" }) {
	return async ({ params }: any, res: any, next: express.NextFunction) => {
		const deviceId = params[options.paramKey];
		if (!mongoose.Types.ObjectId.isValid(deviceId)) return res.status(208).send({ error: "InvalidParam" });

		if (!(await DeviceModel.checkExists(deviceId))) return res.status(404).send({ error: "InvalidDeviceId" });

		next();
	};
}
