import { not } from 'ramda';
import { logger } from '../logger';
import express from 'express';
import { Permission } from '../models/interface/userInterface';
import { UserModel } from '../models/userModel';
import { HasContext, RequestWithAuth } from '../types';

/**
 * Middleware validating JWT token in headers and binding User object to request
 */
export default function (
    options: {
        restricted?: boolean;
        methods?: Array<'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'>;
    } = {
            restricted: true,
        }
) {
    return async (req: express.Request & Partial<HasContext>, res: express.Response, next: express.NextFunction) => {
        const { restricted, methods } = options;
        // if (req.url !== '/login') {
        if (not(methods === undefined || methods.some((method) => method === req.method))) next();

        const [type, jwtToken] = (req.get('Authorization') || '').split(' ');
        const apiKey = req.query.api_key || req.get('X-API-Key');

        if (!req.context?.jwtService) {
            throw Error("Missing jwtService in context")
        }
        const jwtService = req.context.jwtService;

        if (!req.context?.userService) {
            throw Error("Missing jwtService in context")
        }
        const userService = req.context.userService

        if (jwtToken) {
            try {
                const payload = (await jwtService.verify(jwtToken)).unsafeCoerce();

                const req2 = req as RequestWithAuth;

                // const user = await UserModel.findById(payload.sub).exec();
                // if (user) {
                logger.debug(`Verified user=${payload.sub}, groups=${payload.groups.join(',')}`);
                req2.user = {
                    _id: payload.sub,
                    groups: payload.groups,
                    accessPermissions: [Permission.write, Permission.read, Permission.control],
                    realm: payload.realm,
                    // root: payload.groups.some((v) => v === 'root'),
                    admin: payload.groups.some((v) => v === 'admin'),
                    refreshTokenId: payload.iss
                }

                next();
                // } else {
                //     logger.debug('userNotExist');
                //     res.status(404).send({ error: 'userNotExist', command: 'logOut' });
                // }
            } catch (err) {
                logger.error('token problem', err);
                res.status(400).send({ error: 'invalidToken' });
            }
        } else if (typeof apiKey === "string") {
            const validationResult = await userService.validateAccessToken(apiKey);
            validationResult
                .ifLeft(() => res.status(400).send({ error: 'invalidToken' }))
                .ifRight(([user, { permissions }]) => {
                    const req2 = req as RequestWithAuth;
                    req2.user = user;
                    req2.user.accessPermissions = permissions;

                    // full access
                    if (req2.user.accessPermissions.some((b) => b === Permission.write)) {
                        if (req2.user.groups.some((v) => v === 'admin')) req2.user.admin = true;
                    }

                    next();
                })
        } else if (!restricted) {
            next();
        } else {
            res.status(400).send({ error: 'tokenNotProvided' });
        }
    };
}
