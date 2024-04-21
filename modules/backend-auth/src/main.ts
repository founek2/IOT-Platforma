import type Router from "@koa/router";
import { JwtService, UserService } from 'common';
import { BusEmitterType } from 'common/lib/interfaces/asyncEmitter';
import { connectMongoose } from 'common/lib/utils/connectMongoose';
import { applyRouter } from 'common/lib/utils/applyRouter';
import type Koa from "koa";
import api from './api';
import { Config } from './config';
import eventEmitter from './services/eventEmitter';
import { OAuthService } from './services/oauthService';
import { TemporaryPass } from './services/TemporaryPass';
import initSubscribers from './subscribers';
import { Context } from './types';

export * from "./config";
export async function bindServer(router: Router<Koa.DefaultState, Context>, config: Config, bus: BusEmitterType) {
    /* INITIALIZE */
    const jwtService = new JwtService(config.jwt); // used in WebSocket middleware
    const userService = new UserService(jwtService)
    const oauthService = new OAuthService(config.oauth); // used in WebSocket middleware
    const temporaryPassService = new TemporaryPass(bus, config.mqtt);

    initSubscribers(eventEmitter);

    await connectMongoose(config.dbUri);

    router.use("/api/auth", (ctx, next) => {
        ctx.oauthService = oauthService;
        ctx.userService = userService;
        ctx.jwtService = jwtService;
        ctx.temporaryPassService = temporaryPassService;
        return next()
    })

    applyRouter(router, '/api/auth', api())

    return { router }
}