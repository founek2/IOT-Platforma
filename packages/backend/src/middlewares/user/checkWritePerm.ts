import { UserModel } from "common/lib/models/userModel";
import express from "express";
import mongoose from "mongoose";
import checkUser from "./checkUser";

export default function (options: { paramKey: string } = { paramKey: "id" }) {
    return async (req: any, res: express.Response, next: express.NextFunction) => {
        checkUser(options)(req, res, async () => {
            const { params, user = {} } = req;
            const userId = params[options.paramKey];

            if (user.admin || userId == user.id) return next();

            res.status(403).send({ error: "InvalidPermissions" });
        });
    };
}
