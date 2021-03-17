import mongoose, { Model, Document } from "mongoose";
import { INotify } from "./interface/notifyInterface";
import { notifyThingSchema } from "./schema/notifySchema";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface INotifyDocument extends INotify, Document {}

export interface INotifyModel extends Model<INotifyDocument> {}

const notifySchema = new Schema<INotifyDocument>(
	{
		deviceId: { $type: ObjectId, ref: "Device", index: { unique: true } },
		userId: { $type: ObjectId, ref: "User" },
		things: [notifyThingSchema],
	},
	{ typeKey: "$type" }
);

export const NotifyModel = mongoose.model<INotifyDocument, INotifyModel>("Notify_v3", notifySchema);
