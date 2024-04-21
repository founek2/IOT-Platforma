import express from 'express';
import mongoose from 'mongoose';
import { DiscoveryModel } from '../../models/deviceDiscoveryModel';
import { HasState, KoaContext, RequestWithAuth } from '../../types';
import { Permission } from '../../models/interface/userInterface';
import { Next } from 'koa';

/**
 * Middleware to check if discovered device exists and user has permission to it
 * @param options - params[paramKey] -> IDiscovery["_id"]
 */
export function checkDiscoveryMiddleware<C extends KoaContext & HasState>(options: { paramKey: string } = { paramKey: 'id' }) {
    return async (ctx: C, next: Next) => {
        const discoveryId = ctx.params[options.paramKey];
        if (!mongoose.Types.ObjectId.isValid(discoveryId)) {
            ctx.status = 400;
            ctx.body = { error: 'InvalidParam' }
            return;
        }

        if (!(await DiscoveryModel.checkExistsNotPairing(discoveryId))) {
            ctx.status = 404;
            ctx.body = { error: 'InvalidDeviceId' }
            return;
        }

        if (ctx.state.user?.admin) return next();

        if (
            ctx.state.user?.realm &&
            ctx.state.user.accessPermissions?.includes(Permission.write) &&
            (await DiscoveryModel.checkPermissions(discoveryId, ctx.state.user.realm))
        )
            return next();

        ctx.status = 403;
        ctx.body = { error: 'invalidPermissions' }
    };
}

