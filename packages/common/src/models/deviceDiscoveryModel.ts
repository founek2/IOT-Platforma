import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { thingSchema } from "./schema/thingSchema";
import { ComponentType, DeviceClass, IThing } from "./interface/thing";
import { IDeviceDiscovery } from "./interface/discovery";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface DeviceDiscoveryDoc extends IDeviceDiscovery, Document {}

const deviceDiscoverySchema = new Schema<DeviceDiscoveryDoc>(
	{
		deviceId: String,
		userName: String,
		name: String,
		things: Schema.Types.Mixed,
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

export interface DeviceDiscoveryModel extends Model<DeviceDiscoveryDoc> {}

export const DeviceDiscovery = mongoose.model<DeviceDiscoveryDoc, DeviceDiscoveryModel>(
	"Discovery",
	deviceDiscoverySchema
);
