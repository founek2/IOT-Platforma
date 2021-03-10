import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { thingSchema } from "./schema/thingSchema";
import { IThing } from "./interface/thing";
import { HistoricalSensor } from "./interface/history";
import { historicalSensorSchema, IHistorical } from "./schema/historicalSchema";
import { Device } from "./interface/device";
import resetTime from "framework/lib/utils/resetTime";

import { DAY_START_HOURS, DAY_END_HOURS } from "../constants";

export function isDay(dateTime: Date) {
	return dateTime.getHours() >= DAY_START_HOURS && dateTime.getHours() < DAY_END_HOURS;
}

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface HistoricalModel extends Model<IHistorical> {
	saveSensorData(
		deviceId: Device["_id"],
		thingId: IThing["_id"],
		propertyId: IThing["config"]["propertyId"],
		value: any,
		timestamp: Date
	): void;

	saveControlData(
		deviceId: Device["_id"],
		thingId: IThing["_id"],
		propertyId: IThing["config"]["propertyId"],
		value: any,
		timestamp: Date
	): void;

	getData(deviceId: Device["_id"], thingId: IThing["_id"], from: Date, to: Date): Promise<IHistorical[]>;
}

historicalSensorSchema.statics.saveControlData = function (
	deviceId: Device["_id"],
	thingId: IThing["_id"],
	propertyId: IThing["config"]["propertyId"],
	value: any,
	timestamp: Date
) {
	const recKey = `properties.${propertyId}`;
	return this.updateOne(
		{
			device: deviceId,
			thingId,
			nsamples: { $lt: 200 },
			day: resetTime(new Date()),
		},
		{
			$push: { [recKey + ".samples"]: { value, timestamp: timestamp } },
			$inc: {
				nsamples: 1,
			},
			$min: { first: timestamp },
			$max: { last: timestamp },
		},
		{ upsert: true, setDefaultsOnInsert: true }
	).exec();
};

historicalSensorSchema.statics.saveSensorData = function (
	deviceId: Device["_id"],
	thingId: IThing["_id"],
	propertyId: IThing["config"]["propertyId"],
	value: any,
	timestamp: Date
) {
	const recKey = `properties.${propertyId}`;
	const dayPhase = isDay(timestamp) ? "day" : "night";
	return this.updateOne(
		{
			device: deviceId,
			thingId,
			nsamples: { $lt: 200 },
			day: resetTime(new Date()),
		},
		{
			$push: { [recKey + ".samples"]: { value, timestamp: timestamp } },
			$inc: {
				[recKey + ".nsamples." + dayPhase]: 1,
				[recKey + ".sum." + dayPhase]: value,
				nsamples: 1,
			},
			$min: { [recKey + ".min"]: value, first: timestamp },
			$max: { [recKey + ".max"]: value, last: timestamp },
		},
		{ upsert: true, setDefaultsOnInsert: true }
	).exec();
};

historicalSensorSchema.statics.getData = function (
	deviceId: Device["_id"],
	thingId: IThing["_id"],
	from: Date,
	to: Date
) {
	return this.find({
		device: deviceId,
		thingId,
		day: {
			$gte: resetTime(from),
			$lte: resetTime(to),
		},
	})
		.sort({ first: 1 })
		.lean();
};

export const HistoricalModel = mongoose.model<IHistorical, HistoricalModel>("History", historicalSensorSchema);
