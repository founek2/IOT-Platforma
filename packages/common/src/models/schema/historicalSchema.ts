import mongoose, { Document } from "mongoose";
import { HistoricalSensor } from "../interface/history";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IHistorical extends HistoricalSensor, Document {}

export const historicalSensorSchema = new Schema<IHistorical>({
	device: { type: ObjectId, ref: "Device" },
	thingId: ObjectId,
	day: Date,
	first: Date,
	last: Date,
	properties: Schema.Types.Mixed,
	nsamples: Number,
	// [
	// 	{
	// 		propertyId: String,
	// 		samples: [{ value: Number, timestamp: {type: Date, default: Date.now} }],
	// 		sum: {
	// 			day: Number,
	// 			night: Number,
	// 		},
	// 		nsamples: {
	// 			day: Number,
	// 			night: Number,
	// 		},
	// 		min: Number,
	// 		max: Number,
	// 	},
	// ],
});
