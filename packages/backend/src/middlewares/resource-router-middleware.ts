import asyncHandler from 'express-async-handler';
import Express from "express"
var Router = require('express').Router;

type keyes = "index" | 'read' | "create" | "createId" | 'replace' | "replaceId" | 'modify' | "modifyId" | 'delete' | "deleteId"



const map: { [key in keyes]: "get" | "post" | "put" | "delete" | "patch" } = {
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

type middleware = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => any
type IRouteBase = {
    [key in keyes]?: middleware
}
type IRoute = IRouteBase & {
    mergeParams?: boolean,
    middleware?: middleware
    middlewares?: {
        [key in keyes]?: middleware[]
    },
}

// TODO add middleware for ID checking (24 lenght) -> then remove from Models
export default function ResourceRouter(route: IRoute) {
    const router = Router({ mergeParams: !!route.mergeParams });

    if (route.middleware) router.use(route.middleware);
    if (route.middlewares) mapper(route.middlewares, router);

    mapper(route, router);

    return router;
}

type combinedRoute = {
    [key in keyes]?: middleware | middleware[]
}

export function mapper(route: combinedRoute, router: Express.Router) {
    let key: keyes;
    for (key in route) {
        // fn = map[key] || key;
        // if (typeof router[fn]==='function') {
        // 	if (key === "read" || key === "updateId" || key === "patchId" || key === "deleteId"){
        // 		url = "/:id"
        // 	} else {
        // 		url = ~keyed.indexOf(key) && route.load ? ('/:'+route.id) : '/';
        // 	}

        // 	router[fn](url, route[key]);
        // }
        const routeHandler = route[key as keyes];
        if (typeof routeHandler === 'function') {
            apply(key, routeHandler, router);
        } else if (Array.isArray(routeHandler)) {
            for (const i in routeHandler) {
                apply(key, routeHandler[i], router);
            }
        }
    }
}

function apply(key: keyes, fn: middleware, router: Express.Router) {
    const method = map[key] || key;
    if (typeof router[method] != 'function') return;

    let url;
    if (key.endsWith('Id') || key === 'read') {
        url = '/:id';
    } else {
        // url = ~keyed.indexOf(key) && route.load ? '/:' + route.id : '/';
        url = '/';
    }

    router[method](url, asyncHandler(fn));
}
