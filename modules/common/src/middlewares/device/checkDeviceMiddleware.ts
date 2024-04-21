import { DeviceModel } from '../../models/deviceModel';
import mongoose from 'mongoose';
import { KoaContext } from '../../types';
import { Next } from 'koa';
import { sendError } from '../../utils/sendError';

/**
 * Middleware to check if device exists
 * @param options - params[paramKey] -> IDevice["_id"]
 */
export default function <C extends KoaContext>({ paramKey = "id", type }: { paramKey?: string, type?: "metadata" } = { paramKey: "id" }) {
    return async (ctx: C, next: Next) => {
        const deviceId = ctx.params[paramKey];

        if (type === "metadata") {
            if (!(await DeviceModel.checkExistsByMetadata(deviceId))) {
                return sendError(404, 'deviceNotExits', ctx)
            }
        } else {
            if (!mongoose.Types.ObjectId.isValid(deviceId)) {
                return sendError(400, 'invalidParam', ctx)
            }

            if (!(await DeviceModel.checkExists(deviceId))) {
                return sendError(404, 'deviceNotExits', ctx)
            }
        }

        return next();
    };
}
