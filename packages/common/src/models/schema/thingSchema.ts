import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export const thingSchema = new Schema({
	config: {
		name: String,
		nodeId: String,
		componentType: String,
		properties: [
			{
				propertyId: String,
				name: String,
				propertyClass: String,
				unitOfMeasurement: String,
				dataType: String,
				format: Schema.Types.Mixed,
				settable: Boolean,
				retained: Boolean,
			},
		],
	},
	state: {
		timestamp: Date,
		value: String,
	},
});
