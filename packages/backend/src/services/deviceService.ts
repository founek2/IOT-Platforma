import mongoose from "mongoose";
import { IDevice } from "common/lib/models/interface/device";
import { DeviceModel } from "common/lib/models/deviceModel";
import { HistoricalModel } from "common/lib/models/historyModel";
import { NotifyModel } from "common/lib/models/notifyModel";

export const DeviceService = {
	async deleteById(deviceId: IDevice["_id"]): Promise<boolean> {
		const res = await DeviceModel.deleteOne({
			_id: mongoose.Types.ObjectId(deviceId),
		});

		if (res.deletedCount !== 1) return false;

		await HistoricalModel.deleteMany({
			device: mongoose.Types.ObjectId(deviceId),
		});
		await NotifyModel.deleteMany({
			deviceId: mongoose.Types.ObjectId(deviceId),
		});

		return true;
	},
};
