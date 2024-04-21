import auth from './auth';
import signIn from './signIn';
import signOut from './signOut';
import activeSignIn from './activeSignIn';
import refresh from './refreshToken';
import { Context } from '../types';
import Router from "@koa/router"
import type Koa from "koa";
import { applyRouter } from "common/lib/utils/applyRouter"

export default (): Router<Koa.DefaultState, Context> => {
    let api = new Router<Koa.DefaultState, Context>();

    applyRouter(api, '/rabbitmq', auth())
    applyRouter(api, '/user/signIn/refresh', refresh())
    applyRouter(api, '/user/signIn/active', activeSignIn())
    applyRouter(api, '/user/signIn', signIn())
    applyRouter(api, '/user/signOut', signOut())

    // expose some API metadata at the root
    api.get('/', (ctx) => {
        ctx.body = { version: '2.0.0' };
    });

    return api;
};
