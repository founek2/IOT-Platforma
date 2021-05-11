import { DeviceModel } from 'common/lib/models/deviceModel';
import express from 'express';
import checkDevice from './checkDevice';

/**
 * Middleware to check if device exists and user has permission to write it
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export default function (options: { paramKey: string } = { paramKey: 'id' }) {
    return async (req: any, res: any, next: express.NextFunction) => {
        checkDevice(options)(req, res, async () => {
            const { params, user = {} } = req;
            const deviceId = params[options.paramKey];

            if (user.admin) return next();

            if (user.id && (await DeviceModel.checkWritePerm(deviceId, user.id))) return next();

            return res.status(403).send({ error: 'invalidPermissions' });
        });
    };
}
