import mongoose, { Model, Document } from "mongoose";
import { INotify } from "./interface/notifyInterface";
import { notifyThingSchema } from "./schema/notifySchema";
import { IDevice } from "./interface/device";
import { IThing } from "./interface/thing";
import { IUser } from "./interface/userInterface";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface INotifyDocument extends INotify, Document {}

export interface INotifyModel extends Model<INotifyDocument> {
	getForThing(
		deviceId: IDevice["_id"],
		nodeId: IThing["config"]["nodeId"],
		userId: IUser["_id"]
	): Promise<INotifyDocument[]>;
}

const notifySchema = new Schema<INotifyDocument>(
	{
		deviceId: { $type: ObjectId, ref: "Device", index: { unique: true } },
		userId: { $type: ObjectId, ref: "User" },
		things: [notifyThingSchema],
	},
	{ typeKey: "$type" }
);

notifySchema.statics.getForThing = async function (
	deviceId: IDevice["_id"],
	nodeId: IThing["config"]["nodeId"],
	userId: IUser["_id"]
) {
	return this.findOne(
		{
			deviceId: ObjectId(deviceId),
			userId: ObjectId(userId),
			"things.nodeId": nodeId,
		},
		"things.$"
	);
};

export const NotifyModel = mongoose.model<INotifyDocument, INotifyModel>("Notify_v3", notifySchema);
