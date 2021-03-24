import mongoose, { Document, Model } from "mongoose";
import { IDiscovery } from "./interface/discovery";
import { IUser } from "./interface/userInterface";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IDiscoveryDocument extends IDiscovery, Document {}

const deviceDiscoverySchema = new Schema<IDiscoveryDocument, IDiscoveryModel>(
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

export interface IDiscoveryModel extends Model<IDiscoveryDocument> {
	checkExists(id: IDiscovery["_id"]): Promise<boolean>;
	checkPermissions(id: IDiscovery["_id"], realm: IUser["realm"]): Promise<boolean>;
}

deviceDiscoverySchema.statics.checkExists = function (id: IDiscovery["_id"]) {
	return this.exists({
		_id: ObjectId(id),
	});
};

deviceDiscoverySchema.statics.checkExists = function (id: IDiscovery["_id"], realm: IUser["realm"]) {
	return this.exists({
		_id: ObjectId(id),
		realm,
	});
};

export const DiscoveryModel = mongoose.model<IDiscoveryDocument, IDiscoveryModel>("Discovery", deviceDiscoverySchema);
