import mongoose, { Document, Model } from "mongoose";
import hat from "hat";
import { thingSchema } from "./schema/thing";
import { IUser } from "./user";
import { devLog } from "framework/lib/logger";
import { Device } from "./interface/device";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IDevice extends Device, Document {
	createdBy: IUser["_id"];
}

const deviceSchema = new Schema<IDevice>(
	{
		info: {
			title: { type: String },
			description: { type: String },
			imgPath: { type: String },
			deviceId: { type: String, required: true },
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
				value: String,
				timestamp: Date,
			},
			lastAck: Date,
		},
		metadata: {
			topicPrefix: String,
			publicRead: Boolean,
		},
	},
	{ timestamps: true }
);

export interface IDeviceModel extends Model<IDevice> {
	createNew(
		device: { info: any; things: any[]; metadata: { topicPrefix: string } },
		ownerId: string
	): Promise<IDevice>;
	// findForPublic(): Promise<IDevice[]>;
	findForUser(userId: string): Promise<IDevice[]>;
	login(topicPrefix: string, deviceId: string, apiKey: string): Promise<boolean>;
}

deviceSchema.statics.createNew = async function ({ info, things, metadata }, userID) {
	const objID = ObjectId(userID);

	const result = await this.exists({
		"info.deviceId": info.deviceId,
		"metadata.topicPrefix": metadata.topicPrefix,
	});
	if (result) throw Error("deviceIdTaken");

	const newDevice = await this.create({
		info,
		things,
		permissions: { read: [objID], write: [objID], control: [objID] },
		metadata,
		createdBy: objID,
	});
	// if (imgExtension) newDevice.info.imgPath = `/${IMAGES_DEVICES_FOLDER}/${newDevice.id}.${imgExtension}`;
	devLog("Creating device", newDevice);
	return newDevice;
};

const aggregationFields = {
	_id: 1,
	"gps.coordinates": 1,
	// "gps.type": 0,
	info: 1,
	createdAt: 1,
	createdBy: 1,
	publicRead: 1,
	state: 1,
};

deviceSchema.statics.findForUser = async function (userID) {
	console.log("finding for userID", userID);
	const userObjID = ObjectId(userID);
	return this.aggregate([
		{
			$match: {
				$or: [
					{ publicRead: true },
					{ "permissions.write": userObjID },
					{ "permissions.read": userObjID },
					{ "permissions.control": userObjID },
				],
			},
		},
		{
			$project: {
				...aggregationFields,
				things: {
					$cond: {
						if: {
							$or: [
								{ $in: [userObjID, "$permissions.control"] },
								{ $in: [userObjID, "$permissions.read"] },
							],
						},
						then: "$things",
						else: "$$REMOVE",
					},
				},
				permissions: {
					read: {
						$cond: {
							if: { $in: [userObjID, "$permissions.read"] },
							then: "$permissions.read",
							else: "$$REMOVE",
						},
					},
					write: {
						$cond: {
							if: { $in: [userObjID, "$permissions.write"] },
							then: "$permissions.write",
							else: "$$REMOVE",
						},
					},
					control: {
						$cond: {
							if: { $in: [userObjID, "$permissions.control"] },
							then: "$permissions.control",
							else: "$$REMOVE",
						},
					},
				},
			},
		},
	]);
};

deviceSchema.statics.login = async function (topicPrefix: string, deviceId: string, apiKey: string) {
	return await this.exists({
		"metadata.topicPrefix": topicPrefix,
		"info.deviceId": deviceId,
		apiKey: apiKey,
	});
};

export const DeviceModel: IDeviceModel = mongoose.model<IDevice, IDeviceModel>("DeviceAdded", deviceSchema);
