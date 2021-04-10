import express from "express"
import { DeviceModel } from 'common/lib/models/deviceModel';
import checkDevice from "./checkDevice";

export default function (options: { paramKey: string } = { paramKey: "id" }) {
    return async (req: any, res: express.Response, next: express.NextFunction) => {
        checkDevice(options)(req, res, async () => {
            const { params, user = {} } = req;
            const deviceId = params[options.paramKey];

            if (user.admin) return next();

            if (await DeviceModel.checkControlPerm(deviceId, user.id)) return next();

            res.status(403).send({ error: 'invalidPermissions' });
        });
    };
}
