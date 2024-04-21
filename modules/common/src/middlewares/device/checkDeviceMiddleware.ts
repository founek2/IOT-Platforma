import { DeviceModel } from '../../models/deviceModel';
import mongoose from 'mongoose';
import { KoaContext } from '../../types';
import { Next } from 'koa';

/**
 * Middleware to check if device exists
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export default function <C extends KoaContext>({ paramKey = "id", type }: { paramKey?: string, type?: "metadata" } = { paramKey: "id" }) {
    return async (ctx: C, next: Next) => {
        const deviceId = ctx.params[paramKey];

        if (type === "metadata") {
            if (!(await DeviceModel.checkExistsByMetadata(deviceId))) {
                ctx.status = 404
                ctx.body = { error: 'deviceNotExits' }
                return;
            }
        } else {
            if (!mongoose.Types.ObjectId.isValid(deviceId)) {
                ctx.status = 400
                ctx.body = { error: 'InvalidParam' }
                return;
            }

            if (!(await DeviceModel.checkExists(deviceId))) {
                ctx.status = 404
                ctx.body = { error: 'deviceNotExits' }
                return
            }
        }

        return next();
    };
}
