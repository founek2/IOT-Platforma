import mongoose, { Document } from "mongoose";
import hat from "hat";
import { ComponentType, DeviceClass } from "../interface/thing";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export const thingSchema = new Schema({
	config: {
		name: String,
		nodeId: String,
		componentType: String,
		properties: [
			{
				deviceClass: String,
				name: String,
				unitOfMeasurement: String,
				propertyId: String,
				dataType: String,
			},
		],
	},
	state: {
		timestamp: Date,
		value: String,
	},
});
