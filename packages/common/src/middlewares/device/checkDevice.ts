import { DeviceModel } from '../../models/deviceModel.js';
import express from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to check if device exists
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export default function (options: { paramKey: string } = { paramKey: 'id' }) {
    return async ({ params }: any, res: express.Response, next: express.NextFunction) => {
        const deviceId = params[options.paramKey];
        if (!mongoose.Types.ObjectId.isValid(deviceId)) return res.status(400).send({ error: 'InvalidParam' });

        if (!(await DeviceModel.checkExists(deviceId))) return res.status(404).send({ error: 'deviceNotExits' });

        next();
    };
}
