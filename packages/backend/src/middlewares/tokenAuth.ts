import { JwtService } from 'common/src/services/jwtService';
import mongoose from 'mongoose';
import { equals, T, not } from 'ramda';
import { logger } from 'framework-ui/src/logger';

import { enrichGroups } from 'framework-ui/src/privileges';
import express from 'express';
import { IUser, Permission } from 'common/src/models/interface/userInterface';
import { UserModel } from 'common/src/models/userModel';
import { RequestWithAuth } from '../types';

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
                    req2.user.groups = enrichGroups(req2.user.groups);
                    if (req2.user.groups.some(equals('root'))) req2.root = true;
                    if (req2.user.groups.some(equals('admin'))) req2.user.admin = true;
                    next();
                } else {
                    logger.debug('userNotExist');
                    res.status(404).send({ error: 'userNotExist', command: 'logOut' });
                }
            } catch (err) {
                logger.error('token problem', err);
                res.status(400).send({ error: 'invalidToken' });
            }
            return;
        } else if (accessToken) {
            const user = await UserModel.findOne(
                {
                    'accessTokens.token': accessToken,
                    $or: [{ 'accessTokens.validTo': { $lte: new Date() } }, { 'accessTokens.validTo': null }],
                },
                'accessTokens.$ groups'
            ).lean();
            if (!user || !user.accessTokens?.length) return res.status(400).send({ error: 'invalidToken' });

            const req2 = req as RequestWithAuth;
            req2.user = user;
            req2.user.accessPermissions = user.accessTokens[0].permissions;
            req2.user.groups = enrichGroups(req2.user.groups);

            // full access
            if (req2.user.accessPermissions.some((b) => b === Permission.write)) {
                if (req2.user.groups.some(equals('root'))) req2.root = true;
                if (req2.user.groups.some(equals('admin'))) req2.user.admin = true;
            }

            return next();
        } else if (!restricted) {
            return next();
        }

        res.status(400).send({ error: 'tokenNotProvided' });
    };
}
