import checkUser from './checkUserMiddleware';
import { HasState, KoaContext } from '../../types';
import { Permission } from '../../models/interface/userInterface';
import { Next } from 'koa';

/**
 * Middleware to check if user exists and initiator of request has permission to write
 * @param options - params[paramKey] -> IUser["_id"]
 */
export default function <C extends KoaContext & HasState>(options: { paramKey: string } = { paramKey: 'id' }) {
    return async (ctx: C, next: Next) => {
        return checkUser(options)(ctx, async () => {
            const { params, state } = ctx;
            const userId = params[options.paramKey];

            if (!state.user) {
                ctx.status = 403;
                ctx.body = { error: 'missingUser' }
                return
            }

            if (state.user?.admin || (userId == state.user?._id && state.user?.accessPermissions?.includes(Permission.write)))
                return next();

            ctx.status = 403
            ctx.body = { error: 'InvalidPermissions' }
        });
    };
}
