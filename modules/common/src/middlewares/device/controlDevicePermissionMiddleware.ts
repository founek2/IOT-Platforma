import { DeviceModel } from '../../models/deviceModel';
import checkDeviceMiddleware from './checkDeviceMiddleware';
import { HasState, KoaContext, RequestWithAuthOpt } from '../../types';
import { Permission } from '../../models/interface/userInterface';
import { Next } from 'koa';

/**
 * Middleware to check if device exists and user has permission to read it
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export function controlDevicePermissionMiddleware<C extends KoaContext & HasState>(options: { paramKey: string } = { paramKey: 'id' }) {
    return async (ctx: C, next: Next) => {
        return checkDeviceMiddleware(options)(ctx, async () => {
            const deviceId = ctx.params[options.paramKey];
            if (!ctx.state.user) {
                ctx.status = 403;
                ctx.body = { error: 'missingUser' }
                return
            }
            if (ctx.state.user.admin) return next();

            if (
                ctx.state.user.accessPermissions?.includes(Permission.control) &&
                (await DeviceModel.checkWritePerm(deviceId, ctx.state.user._id))
            )
                return next();

            ctx.status = 403
            ctx.body = { error: 'invalidPermissions' }
        });
    };
}
