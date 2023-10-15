import { JwtService } from '../services/jwtService';
import { equals, T, not } from 'ramda';
import { logger } from '../logger';
import express from 'express';
import { Permission } from '../models/interface/userInterface';
import { UserModel } from '../models/userModel';
import { RequestWithAuth } from '../types';
import { UserService } from '../services/userService';

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
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { restricted, methods } = options;
        // if (req.url !== '/login') {
        if (not(methods === undefined || methods.some((method) => method === req.method))) next();

        const [type, jwtToken] = (req.get('Authorization') || '').split(' ');
        const accessToken = req.query.api_key || req.get('X-API-Key');

        if (jwtToken) {
            try {
                const obj = await JwtService.verify(jwtToken);

                const days7_sec = 7 * 24 * 60 * 60;
                const now_sec = new Date().getTime() / 1000;

                if (obj.exp - now_sec < days7_sec) {
                    logger.info('Resigning jwt token');
                    const newToken = await JwtService.sign({ id: obj.id });
                    res.set('Authorization-JWT-new', newToken);
                }
                const req2 = req as RequestWithAuth;

                const user = await UserModel.findById(obj.id).exec();

                if (user) {
                    logger.debug(`Verified user=${user.info.userName}, groups=${user.groups.join(',')}`);
                    req2.user = user.toObject();
                    req2.user.accessPermissions = [Permission.write, Permission.read, Permission.control];
                    if (req2.user.groups.some((v) => v === 'root')) req2.root = true;
                    if (req2.user.groups.some((v) => v === 'admin')) req2.user.admin = true;
                    next();
                } else {
                    logger.debug('userNotExist');
                    res.status(404).send({ error: 'userNotExist', command: 'logOut' });
                }
            } catch (err) {
                logger.error('token problem', err);
                res.status(400).send({ error: 'invalidToken' });
            }
        } else if (typeof accessToken === "string") {
            const validationResult = await UserService.validateAccessToken(accessToken);
            validationResult
                .ifLeft(() => res.status(400).send({ error: 'invalidToken' }))
                .ifRight(([user, { permissions }]) => {
                    const req2 = req as RequestWithAuth;
                    req2.user = user;
                    req2.user.accessPermissions = permissions;

                    // full access
                    if (req2.user.accessPermissions.some((b) => b === Permission.write)) {
                        if (req2.user.groups.some((v) => v === 'root')) req2.root = true;
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
