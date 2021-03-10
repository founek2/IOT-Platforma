import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { thingSchema } from "./schema/thingSchema";
import { IThing } from "./interface/thing";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface DeviceDiscovery {
	_id?: any;
	deviceId: string;
	userName: string;
	name: string;
	things: IThing[];
	createdAt: Date;
	updatedAt: Date;
	state: {
		status: {
			value: string;
			timestamp: Date;
		};
	};
	pairing: boolean;
}

export interface IDeviceDiscovery extends DeviceDiscovery, Document {}

const deviceDiscoverySchema = new Schema<IDeviceDiscovery>(
	{
		deviceId: String,
		userName: String,
		name: String,
		things: [thingSchema],
		state: {
			status: {
				value: String,
				timestamp: Date,
			},
		},
		pairing: Boolean,
	},
	{ timestamps: true }
);

export interface DeviceDiscoveryModel extends Model<IDeviceDiscovery> {}

export const DeviceDiscovery = mongoose.model<IDeviceDiscovery, DeviceDiscoveryModel>(
	"Discovery",
	deviceDiscoverySchema
);
