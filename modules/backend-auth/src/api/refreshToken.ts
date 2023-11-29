import { fieldDescriptors } from 'common';
import { rateLimiterMiddleware } from 'common/lib/middlewares/rateLimiter';
import resource from 'common/lib/middlewares/resource-router-middleware';
import formDataChecker from 'common/src/middlewares/formDataChecker';
import { Request } from 'express';
import { HasContext } from '../types';

/**
 * URL prefix /authorization
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [
                rateLimiterMiddleware,
                formDataChecker(fieldDescriptors, { allowedForms: ['REFRESH_TOKEN'] }),
            ],
        },

        async create({ body, context }: Request & HasContext, res) {
            const { formData } = body;

            if (formData.REFRESH_TOKEN) {
                (await context.userService.refreshToken(formData.REFRESH_TOKEN.token))
                    .ifLeft((error) => res.status(401).send({ error }))
                    .ifRight(({ accessToken }) => {
                        res.send({
                            token: accessToken,
                            accessToken,
                        });
                    });
            } else res.sendStatus(400);
        },
    });
