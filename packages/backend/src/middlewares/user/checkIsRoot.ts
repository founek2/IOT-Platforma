import express from 'express';
import { RequestWithAuthOpt } from 'backend/src/types';
import { isRoot } from 'backend/src/utils/groups';

export function checkIsRoot() {
    return async ({ user }: RequestWithAuthOpt, res: express.Response, next: express.NextFunction) => {
        return user && isRoot(user) ? next() : res.status(403).send({ error: 'InvalidPermissions' });
    };
}
