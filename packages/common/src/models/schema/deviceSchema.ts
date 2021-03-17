import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { IDevice } from "../interface/device";
import { IUser } from "../interface/userInterface";
import { thingSchema } from "./thingSchema";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IDeviceDocument extends IDevice, Document {
	createdBy: IUser["_id"];
}

export const deviceSchema = new Schema<IDeviceDocument>(
	{
		info: {
			name: { type: String },
			description: { type: String },
			imgPath: { type: String },
			location: {
				building: String,
				room: String,
			},
		},
		apiKey: { type: String, default: hat, index: { unique: true } },
		publicRead: Boolean,
		permissions: {
			read: [{ type: ObjectId, ref: "User" }],
			write: [{ type: ObjectId, ref: "User" }],
			control: [{ type: ObjectId, ref: "User" }],
		},
		createdBy: { type: ObjectId, ref: "User" },
		things: [thingSchema],
		state: {
			// paired: {
			// 	value: { type: Boolean, default: false },
			// 	timestamp: Date,
			// },
			status: {
				value: Schema.Types.Mixed,
				timestamp: Date,
			},
			lastAck: Date,
		},
		metadata: {
			realm: String,
			publicRead: Boolean,
			deviceId: { type: String, required: true },
		},
	},
	{ timestamps: true }
);
