import { JwtService } from 'common/lib/services/jwtService';
import mongoose from 'mongoose';
import { equals, T, not } from 'ramda';
import { infoLog, warningLog } from 'framework-ui/lib/logger';

import { enrichGroups } from 'framework-ui/lib/privileges';
import express from 'express';
import { IUser, Permission } from 'common/lib/models/interface/userInterface';
import { UserModel } from 'common/lib/models/userModel';
import { RequestWithAuth } from '../types';

/**
 * Middleware validating JWT token in headers and binding User object to request
 */
export default function (options: { restricted: boolean; methods?: Array<'PUT'> } = { restricted: true }) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { restricted, methods } = options;
        // if (req.url !== '/login') {
        if (not(methods === undefined || methods.some((method) => method === req.method))) next();

        const jwtToken = req.get('Authorization-JWT');
        const { token: accessToken } = req.query;

        console.log('jwt', jwtToken, 'token', accessToken);
        if (jwtToken) {
            try {
                const obj = await JwtService.verify(jwtToken);

                const days7_sec = 7 * 24 * 60 * 60;
                const now_sec = new Date().getTime() / 1000;

                if (obj.exp - now_sec < days7_sec) {
                    infoLog('Resigning jwt token');
                    const newToken = await JwtService.sign({ id: obj.id });
                    res.set('Authorization-JWT-new', newToken);
                }
                const req2 = req as RequestWithAuth;

                const user = await UserModel.findById(obj.id).exec();

                if (user) {
                    infoLog(`Verified user=${user.info.userName}, groups=${user.groups.join(',')}`);
                    req2.user = user.toObject();
                    req2.user.accessPermissions = [Permission.write, Permission.read, Permission.control];
                    req2.user.groups = enrichGroups(req2.user.groups);
                    if (req2.user.groups.some(equals('root'))) req2.root = true;
                    if (req2.user.groups.some(equals('admin'))) req2.user.admin = true;
                    next();
                } else {
                    warningLog('userNotExist');
                    res.status(404).send({ error: 'userNotExist', command: 'logOut' });
                }
            } catch (err) {
                console.log('token problem', err);
                res.status(400).send({ error: 'invalidToken' });
            }
            return;
        } else if (accessToken) {
            const user = await UserModel.findOne({ 'accessTokens.token': accessToken }, 'accessTokens.$ groups').lean();
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
