import { RateLimiterMemory } from "rate-limiter-flexible";
import Express from "express";

const opts = {
    points: 6, // 6 points
    duration: 1, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

export const rateLimiterMiddleware = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send("Too Many Requests");
        });
};
