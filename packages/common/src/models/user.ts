import mongoose, { Model, Document } from "mongoose";
import Jwt from "framework/lib/services/jwt";
// import { createHash, compare } from '../lib/password'
import catcher from "framework/lib/mongoose/catcher";
import { keys } from "ramda";
import { devLog } from "framework/lib/logger";
import { AuthTypes } from "common/lib/constants";

const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

export interface IUser extends Document {
	info: {
		userName: string;
		firstName: string;
		lastName: string;
		email?: string;
		phoneNumber?: string;
	};
	auth: {
		type: AuthTypes;
		password: string;
	};
	groups: string[];
	notifyTokens: string[];
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>({
	info: {
		userName: { type: String, required: true, index: { unique: true } },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, lowercase: true },
		phoneNumber: { type: String },
	},
	auth: {
		type: { type: String, default: "passwd", enum: ["passwd", "webAuth"] },
		password: { type: String, required: true },
	},
	// created: { type: Date, default: Date.now },
	groups: { type: [String], default: ["user"] },
	devices: Object, // {sensors: {order: [id, id, id]}, }
	notifyTokens: [],
});

export interface UserModel extends Model<IUser> {}

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
