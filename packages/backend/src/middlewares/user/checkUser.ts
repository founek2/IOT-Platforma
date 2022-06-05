import { UserModel } from '@common/models/userModel';
import express from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to check if user exists
 * @param options - params[paramKey] -> IUser["_id"]
 */
export default function (options: { paramKey: string } = { paramKey: 'id' }) {
    return async ({ params }: any, res: any, next: express.NextFunction) => {
        const userId = params[options.paramKey];
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(208).send({ error: 'InvalidParam' });

        if (!(await UserModel.checkExists(userId))) return res.status(404).send({ error: 'userNotExist' });

        next();
    };
}
