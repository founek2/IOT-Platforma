import Koa from "koa"

declare module 'koa-mongo-sanitize' {
    function foo(): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any>;
    export = foo;
}
