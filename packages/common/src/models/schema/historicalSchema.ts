import mongoose, { Document } from "mongoose";
import { HistoricalSensor } from "../interface/history";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IHistorical extends HistoricalSensor, Document {}

export const historicalSchemaPlain = {
	device: { type: ObjectId, ref: "Device" },
	thingId: ObjectId,
	day: Date,
	first: Date,
	last: Date,
	properties: Schema.Types.Mixed,
	nsamples: Number,
};
