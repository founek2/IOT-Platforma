import mongoose, { Model } from "mongoose";
import { IThing, IThingProperty } from "./interface/thing";
import { historicalSchemaPlain, IHistorical } from "./schema/historicalSchema";
import { IDevice } from "./interface/device";
import resetTime from "../utils/resetTime";

import { DAY_START_HOURS, DAY_END_HOURS } from "../constants";

export function isDay(dateTime: Date) {
	return dateTime.getHours() >= DAY_START_HOURS && dateTime.getHours() < DAY_END_HOURS;
}

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export const historicalSensorSchema = new Schema<IHistorical, HistoricalModel>(historicalSchemaPlain);

export interface HistoricalModel extends Model<IHistorical> {
	saveData(
		deviceId: IDevice["_id"],
		thingId: IThing["_id"],
		propertyId: IThingProperty["propertyId"],
		value: string | number,
		timestamp: Date
	): void;

	getData(deviceId: IDevice["_id"], thingId: IThing["_id"], from: Date, to: Date): Promise<IHistorical[]>;
}

historicalSensorSchema.statics.saveData = function (
	deviceId: IDevice["_id"],
	thingId: IThing["_id"],
	propertyId: IThingProperty["propertyId"],
	value: string | number,
	timestamp: Date
): void {
	if (typeof value === "number") saveNumericData(deviceId, thingId, propertyId, value, timestamp, HistoricalModel);
	else saveStrData(deviceId, thingId, propertyId, value, timestamp, HistoricalModel);
};

historicalSensorSchema.statics.getData = function (
	deviceId: IDevice["_id"],
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

function saveStrData(
	deviceId: IDevice["_id"],
	thingId: IThing["_id"],
	propertyId: IThingProperty["propertyId"],
	value: string,
	timestamp: Date,
	model: HistoricalModel
) {
	const recKey = `properties.${propertyId}`;
	return model
		.updateOne(
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
		)
		.exec();
}

function saveNumericData(
	deviceId: IDevice["_id"],
	thingId: IThing["_id"],
	propertyId: IThingProperty["propertyId"],
	value: any,
	timestamp: Date,
	model: HistoricalModel
) {
	const recKey = `properties.${propertyId}`;
	const dayPhase = isDay(timestamp) ? "day" : "night";
	return model
		.updateOne(
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
		)
		.exec();
}

export const HistoricalModel = mongoose.model<IHistorical, HistoricalModel>("History", historicalSensorSchema);
