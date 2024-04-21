import { RateLimiterMemory } from 'rate-limiter-flexible';
import Express from 'express';
import { KoaContext } from '../types';
import { Next } from 'koa';

const opts = {
    points: 10, // 10 points
    duration: 60, // Per minute
};

const rateLimiter = new RateLimiterMemory(opts);

/**
 * Middleware limits requrest rate
 * @param req
 * @param res
 * @param next
 */
export const rateLimiterMiddleware = async (ctx: KoaContext, next: Next) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') return next();

    try {
        await rateLimiter
            .consume(ctx.request.ip)
        return next();
    } catch (err) {
        ctx.status = 429;
        ctx.body = { error: "Too Many Requests" }
    }
};
