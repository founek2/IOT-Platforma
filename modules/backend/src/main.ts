import { JwtService, UserService } from 'common';
import loadersInit from './loaders';
import { MailerService } from './services/mailerService';
import { Config } from './config';
import { Actions } from './services/actionsService';
import { BrokerService } from './services/brokerService';
import { BusEmitterType } from "common/lib/interfaces/asyncEmitter"
import { PassKeeper } from "common/lib/services/passKeeperService";
import Router from '@koa/router';
import Koa from "koa"
import { Context } from './types/index';
import api from './api';
import api2 from './api/v2';
import { applyRouter } from 'common/lib/utils/applyRouter';

export * from "./config"
export async function bindServer(router: Router<Koa.DefaultState, Context>, config: Config, bus: BusEmitterType) {
    /* INITIALIZE */
    const jwtService = new JwtService(config.jwt); // used in WebSocket middleware
    const mailerService = new MailerService(config);
    const userService = new UserService(jwtService)
    const actionsService = new Actions(bus)
    const passKeper = new PassKeeper(bus);
    const brokerService = new BrokerService(actionsService, config.mqtt, passKeper)
    const context = {
        jwtService,
        mailerService,
        userService,
        actionsService,
        brokerService,
    };

    router.use("/api/main", (ctx, next) => {
        ctx.mailerService = mailerService;
        ctx.userService = userService;
        ctx.actionsService = actionsService;
        ctx.brokerService = brokerService;
        ctx.jwtService = jwtService;
        return next()
    })

    applyRouter(router, '/api/main/v2', api2());
    applyRouter(router, '/api/main', api({ config }));

    await loadersInit({ config, context });

    return { router, context }
}