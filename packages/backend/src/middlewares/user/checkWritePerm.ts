import { UserModel } from "common/lib/models/userModel";
import express from "express";
import mongoose from "mongoose";

export default function (options: { paramKey: string } = { paramKey: "id" }) {
	return async (req: any, res: any, next: express.NextFunction) => {
		const { params, user = {} } = req;
		const userId = params[options.paramKey];

		if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ error: "InvalidParam" });
		if (!(await UserModel.checkExist(userId))) return res.status(404).send({ error: "InvalidUserId" });

		if (user.admin) return next();
		if (userId == user.id) return next();

		res.status(403).send({ error: "InvalidPermissions" });
	};
}
