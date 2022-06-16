import { DeviceModel } from '../../models/deviceModel';
import express from 'express';
import checkDevice from './checkDevice';
import { RequestWithAuthOpt } from '../../types';
import { Permission } from '../../models/interface/userInterface';

/**
 * Middleware to check if device exists and user has permission to read it
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export default function (options: { paramKey: string } = { paramKey: 'id' }) {
    return async (req: RequestWithAuthOpt, res: express.Response, next: express.NextFunction) => {
        checkDevice(options)(req, res, async () => {
            const { params, user } = req;
            const deviceId = params[options.paramKey];
            if (!user) return res.status(403).send({ error: 'invalidPermissions' });

            if (user.admin) return next();

            if (
                user.accessPermissions?.some((b) => Permission.read) &&
                (await DeviceModel.checkReadPerm(deviceId, user._id))
            )
                return next();

            res.status(404).send({ error: 'invalidPermissions' });
        });
    };
}
