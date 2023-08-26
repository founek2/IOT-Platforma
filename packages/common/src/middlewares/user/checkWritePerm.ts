import express from 'express';
import checkUser from './checkUser.js';
import { RequestWithAuthOpt } from '../../types.js';
import { Permission } from '../../models/interface/userInterface.js';

/**
 * Middleware to check if user exists and initiator of request has permission to write
 * @param options - params[paramKey] -> IUser["_id"]
 */
export default function (options: { paramKey: string } = { paramKey: 'id' }) {
    return async (req: RequestWithAuthOpt, res: express.Response, next: express.NextFunction) => {
        checkUser(options)(req, res, async () => {
            const { params, user } = req;
            const userId = params[options.paramKey];

            if (user?.admin || (userId == user?._id && user?.accessPermissions?.includes(Permission.write)))
                return next();

            res.status(403).send({ error: 'InvalidPermissions' });
        });
    };
}
