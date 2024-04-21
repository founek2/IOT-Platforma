import { Next } from 'koa';
import { HasState, KoaContext } from '../../types';
import { isRoot } from '../../utils/groups';
import { sendError } from '../../utils/sendError';

export function checkIsRootMiddleware<C extends KoaContext & HasState>() {
    return async (ctx: C, next: Next) => {
        const { user } = ctx.state;
        return user && isRoot(user.groups) ? next() : sendError(403, 'InvalidPermissions', ctx);
    };
}
