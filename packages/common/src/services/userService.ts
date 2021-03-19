import argon2 from "argon2";
import { IUser } from "../models/interface/userInterface";
import { devLog } from "framework-ui/lib/logger";
import { UserModel } from "../models/userModel";
import { JwtService } from "../services/jwtService";
import { IUserDocument } from "../models/schema/userSchema";
import mongoose from "mongoose";
import { AuthTypes } from "../constants";

async function createHash(plainText: string) {
	return argon2.hash(plainText);
}

function comparePasswd(plainText: string, hash: IUser["auth"]["password"]) {
	return argon2.verify(hash, plainText);
}

export type UserWithToken = { doc: IUser; token: string };
export type CredentialData = {
	userName: IUser["info"]["userName"];
	password: IUser["auth"]["password"];
	authType: IUser["auth"]["type"];
};

export const UserService = {
	async create(object: IUser): Promise<UserWithToken> {
		const { password, type } = object.auth;
		if (type && type !== AuthTypes.PASSWD) throw new Error("notImplemented");
		devLog("user creating:", object);
		const hash = await createHash(password);

		const user = new UserModel({ ...object, auth: { password: hash }, realm: object.info.userName });
		const obj = await user.save();
		const plainUser = obj.toObject();

		const token = await JwtService.sign(plainUser);
		return { doc: plainUser, token };
	},

	async checkCreditals({ userName, authType, password }: CredentialData): Promise<UserWithToken> {
		if (authType !== AuthTypes.PASSWD) throw new Error("notImplemented");

		const doc = await UserModel.findOne({ "info.userName": userName, "auth.type": authType });
		if (!doc) throw Error("unknownUser");

		const matched = await comparePasswd(password, doc.auth.password);
		if (!matched) throw Error("passwordMissmatch");

		const token = await JwtService.sign({ id: doc._id });

		return {
			token,
			doc: doc.toObject(),
		};
	},

	async updateUser(userID: IUser["_id"], data: Partial<IUser>): Promise<IUserDocument> {
		if (data.auth && data.auth.password) {
			const { password } = data.auth;
			const hash = await createHash(password);
			data.auth.password = hash;
		} else delete data.auth;

		const doc = await UserModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userID) }, { $set: data });
		if (!doc) throw Error("unknownUser");

		return doc;
	},
};
