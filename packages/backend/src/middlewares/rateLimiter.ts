import { RateLimiterMemory } from 'rate-limiter-flexible';
import Express from 'express';

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
export const rateLimiterMiddleware = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
};
