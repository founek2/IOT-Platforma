import asyncHandler from 'express-async-handler';
import Express from 'express';
import { Router } from 'express';

export type ActionKeys =
    | 'index'
    | 'read'
    | 'create'
    | 'createId'
    | 'replace'
    | 'replaceId'
    | 'modify'
    | 'modifyId'
    | 'delete'
    | 'deleteId';

export const actionMap: { [key in ActionKeys]: 'get' | 'post' | 'put' | 'delete' | 'patch' } = {
    index: 'get',
    read: 'get',
    create: 'post',
    createId: 'post',
    replace: 'put',
    replaceId: 'put',
    modify: 'patch',
    modifyId: 'patch',
    delete: 'delete',
    deleteId: 'delete',
};

type middleware = (req: any, res: Express.Response, next: Express.NextFunction) => any;
type IRouteBase = {
    [key in ActionKeys]?: middleware;
};
type IRoute = IRouteBase & {
    mergeParams?: boolean;
    middleware?: middleware;
    middlewares?: {
        [key in ActionKeys]?: middleware[];
    };
};

/**
 * Improved interface for native ExpressJS Router
 * @param route
 */
export default function ResourceRouter(route: IRoute) {
    const router = Router({ mergeParams: !!route.mergeParams });

    if (route.middleware) router.use(route.middleware);
    if (route.middlewares) mapper(route.middlewares, router);

    mapper(route, router);

    return router;
}

type combinedRoute = {
    [key in ActionKeys]?: middleware | middleware[];
};

export function mapper(route: combinedRoute, router: Express.Router) {
    let key: ActionKeys;
    for (key in route) {
        const routeHandler = route[key as ActionKeys];
        if (typeof routeHandler === 'function') {
            apply(key, routeHandler, router);
        } else if (Array.isArray(routeHandler)) {
            for (const i in routeHandler) {
                apply(key, routeHandler[i], router);
            }
        }
    }
}

function apply(key: ActionKeys, fn: middleware, router: Express.Router) {
    const method = actionMap[key] || key;
    if (typeof router[method] != 'function') return;

    let url;
    if (key.endsWith('Id') || key === 'read') {
        url = '/:id';
    } else {
        // url = ~keyed.indexOf(key) && route.load ? '/:' + route.id : '/';
        url = '/';
    }

    router[method](url, asyncHandler(fn as any));
}
