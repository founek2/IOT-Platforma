import mongoose, { Document } from "mongoose";
import hat from "hat";
import { ComponentType, DeviceClass } from "../interface/thing";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export const thingSchema = new Schema({
	config: {
		deviceClass: {
			type: String,
			enum: Object.values(DeviceClass),
		},
		name: String,
		unitOfMeasurement: String,
		nodeId: String,
		propertyId: String,
		componentType: {
			type: String,
			enum: Object.values(ComponentType),
		},
	},
	state: {
		timestamp: Date,
		value: String,
	},
});
