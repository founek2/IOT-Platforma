import mongoose, { Document, Model } from "mongoose";
import { IDiscovery } from "./interface/discovery";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IDiscoveryDocument extends IDiscovery, Document {}

const deviceDiscoverySchema = new Schema<IDiscoveryDocument>(
	{
		deviceId: String,
		realm: String,
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

export interface IDiscoveryModel extends Model<IDiscoveryDocument> {}

export const DiscoveryModel = mongoose.model<IDiscoveryDocument, IDiscoveryModel>("Discovery", deviceDiscoverySchema);
