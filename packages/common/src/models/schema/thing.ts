import mongoose, { Document } from "mongoose";
import hat from "hat";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export enum DeviceClass {
	Temperature = "temperature",
	Humidity = "humidity",
	Pressure = "pressure",
	Voltage = "voltage",
}

export enum ComponentType {
	Sensor = "sensor",
	BinarySensor = "binary_sensor",
	Switch = "switch",
}

export interface IThing {
	_id?: any;
	config: {
		deviceClass?: DeviceClass;
		name?: string;
		unitOfMeasurement?: string;
		nodeId: string;
		propertyId?: string;
		componentType: ComponentType;
	};
	state?: {
		timeStamp: Date;
		value: string;
	};
}

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
