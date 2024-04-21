import Router from "@koa/router"
import type Koa from "koa"

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

type middleware<ContextT> = Router.Middleware<Koa.DefaultState, ContextT>
type IRouteBase<C> = {
    [key in ActionKeys]?: middleware<C>;
};
type IRoute<C> = IRouteBase<C> & {
    // mergeParams?: boolean;
    // middleware?: middleware;
    // middlewares?: {
    //     [key in ActionKeys]?: middleware[];
    // };
};

/**
 * Improved interface for native ExpressJS Router
 * @param route
 */
export default function ResourceRouter<C>(route: IRoute<C>) {
    const router = new Router<Koa.DefaultState, C>();

    // if (route.middleware) router.use(route.middleware);
    // if (route.middlewares) mapper(route.middlewares, router);
    mapper(route, router);

    return router;
}

type combinedRoute<C> = {
    [key in ActionKeys]?: middleware<C> | middleware<C>[];
};

export function mapper<S, C>(route: combinedRoute<C>, router: Router<S, C>) {
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

function apply<S, C>(key: ActionKeys, fn: middleware<C>, router: Router<S, C>) {
    const method = actionMap[key] || key;
    if (typeof router[method] != 'function') return;

    let url;
    if (key.endsWith('Id') || key === 'read') {
        url = '/:id';
    } else {
        // url = ~keyed.indexOf(key) && route.load ? '/:' + route.id : '/';
        url = '/';
    }

    router[method](url, fn);
}
