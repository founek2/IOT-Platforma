import mongoose, { Document } from "mongoose";
import { IUser } from "../interface/userInterface";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IUserDocument extends IUser, Document {}

export const userSchema = new Schema<IUserDocument>(
	{
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
		groups: { type: [String], default: ["user"] },
		devices: Object, // {sensors: {order: [id, id, id]}, }
		notifyTokens: [],
		realm: String,
	},
	{
		toObject: {
			transform: function (doc, ret) {
				ret.id = ret._id.toString();
				delete ret.__v;
				delete ret._id;
				if (ret.auth) delete ret.auth.password;
			},
		},
		timestamps: true,
	}
);
