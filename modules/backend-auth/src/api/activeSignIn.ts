import { UserModel } from 'common';
import resource from 'common/lib/middlewares/resource-router-middleware';
import { HasContext } from '../types';
import tokenAuth from 'common/lib/middlewares/tokenAuth';
import { RequestWithAuth } from "common/lib/types"
import { UAParser } from 'ua-parser-js';

/**
 * URL prefix /authorization
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            index: [tokenAuth()]
        },

        async index({ user }: RequestWithAuth & HasContext, res) {
            const doc = await UserModel.findById(user._id).lean()
            if (!doc) return res.sendStatus(404);

            const activeRefreshTokens = (doc.refreshTokens || [])
                .filter((t) => t.validTo ? t.validTo.getTime() > Date.now() : true)
                .map(t => ({
                    ...t,
                    userAgent: t.userAgent ? new UAParser(t.userAgent).getResult() : undefined,
                }))

            res.send({
                activeRefreshTokens
            })
        },

    });
