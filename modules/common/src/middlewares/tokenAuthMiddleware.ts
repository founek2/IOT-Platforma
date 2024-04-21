import { not } from 'ramda';
import { logger } from '../logger';
import { Permission } from '../models/interface/userInterface';
import { HasState, KoaContext, KoaHasContext } from '../types';
import { Next } from 'koa';

type Options = {
    restricted?: boolean;
    methods?: Array<'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'>;
};
/**
 * Middleware validating JWT token in headers and binding User object to request
 */
export function tokenAuthMiddleware<C extends KoaContext>(
    options: Options = {
        restricted: true,
    }
) {
    return async (ctx: C & Partial<KoaHasContext> & HasState, next: Next) => {
        const { restricted, methods } = options;
        // if (req.url !== '/login') {
        if (not(methods === undefined || methods.some((method) => method === ctx.req.method))) return next();

        const [type, jwtToken] = (ctx.get('Authorization') || '').split(' ');
        const apiKey = ctx.query.api_key || ctx.get('X-API-Key');

        if (!ctx?.jwtService) {
            throw Error("Missing jwtService in context")
        }
        const jwtService = ctx.jwtService;

        if (!ctx?.userService) {
            throw Error("Missing jwtService in context")
        }
        const userService = ctx.userService

        if (jwtToken) {
            try {
                const payload = (await jwtService.verify(jwtToken)).unsafeCoerce();

                // const user = await UserModel.findById(payload.sub).exec();
                // if (user) {
                logger.debug(`Verified user=${payload.sub}, groups=${payload.groups.join(',')}`);
                ctx.state.user = {
                    _id: payload.sub,
                    groups: payload.groups,
                    accessPermissions: [Permission.write, Permission.read, Permission.control],
                    realm: payload.realm,
                    // root: payload.groups.some((v) => v === 'root'),
                    admin: payload.groups.some((v) => v === 'admin'),
                    refreshTokenId: payload.iss
                }

                return next();
                // } else {
                //     logger.debug('userNotExist');
                //     res.status(404).send({ error: 'userNotExist', command: 'logOut' });
                // }
            } catch (err) {
                logger.error('token problem', err);
                ctx.status = 400
                ctx.body = { error: "invalidToken" }
            }
        } else if (typeof apiKey === "string") {
            const validationResult = await userService.validateAccessToken(apiKey);
            validationResult
                .ifLeft(() => {
                    ctx.status = 400
                    ctx.body = { error: "invalidToken" }
                })
                .ifRight(([user, { permissions }]) => {
                    ctx.state.user = user;
                    ctx.state.user.accessPermissions = permissions;

                    // full access
                    if (ctx.state.user.accessPermissions.some((b) => b === Permission.write)) {
                        if (ctx.state.user.groups.some((v) => v === 'admin')) ctx.state.user.admin = true;
                    }

                    return next();
                })
        } else if (!restricted) {
            return next();
        } else {
            ctx.status = 400
            ctx.body = { error: "tokenNotProvided" }
        }
    };
}

