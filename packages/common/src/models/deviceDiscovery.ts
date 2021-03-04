import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { IThing, thingSchema } from "./schema/thing";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface DeviceDiscovery {
	deviceId: string;
	userName: string;
	things: IThing[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IDeviceDiscovery extends DeviceDiscovery, Document {}

const deviceDiscoverySchema = new Schema<IDeviceDiscovery>(
	{
		deviceId: String,
		userName: String,
		things: [thingSchema],
	},
	{ timestamps: true }
);

export interface DeviceDiscoveryModel extends Model<IDeviceDiscovery> {}

export const DeviceDiscovery = mongoose.model<IDeviceDiscovery, DeviceDiscoveryModel>(
	"Discovery",
	deviceDiscoverySchema
);
