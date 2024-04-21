import Router from "@koa/router";

export function applyRouter<S, C>(router: Router<S, C>, prefix: string, nestedRouter: Router<S, C>) {
    router.use(prefix, nestedRouter.routes(), nestedRouter.allowedMethods());
}