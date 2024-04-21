import { UserModel } from '../../models/userModel';
import mongoose from 'mongoose';
import { logger } from '../../logger';
import { KoaContext } from '../../types';
import { Next } from 'koa';

/**
 * Middleware to check if user exists
 * @param options - params[paramKey] -> IUser["_id"]
 */
export default function <C extends KoaContext>(options: { paramKey: string } = { paramKey: 'id' }) {
    return async (ctx: C, next: Next) => {
        const userId = ctx.params[options.paramKey];
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            logger.warning("Malformed userId", userId, options.paramKey, ctx.params)
            ctx.status = 400
            ctx.body = { error: 'InvalidParam' }
            return;
        };

        if (!(await UserModel.checkExists(userId))) {
            ctx.status = 400
            ctx.body = { error: 'userNotExist' }
            return;
        }

        return next();
    };
}
