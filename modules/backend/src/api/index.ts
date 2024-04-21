import user from './user';
import device from './device';
import notify from './notify';
import discovery from './discovery';
import thing from './thing';
import thingState from './thingState';
import accessToken from './accessToken';
import subscriptionChange from './subscriptionChange';
import broker from './broker';
import configApi from './config';
import { Config } from '../config';
import notification from './notification';
import Router from "@koa/router"
import type Koa from "koa";
import { Context } from '../types/index';
import { applyRouter } from "common/lib/utils/applyRouter"

export default ({ config }: { config: Config }) => {
    let api = new Router<Koa.DefaultState, Context>();

    // mount the user resource
    // api.use('/user/:userId/accessToken', accessToken());
    // api.use('/user/:userId/notification', notification());
    // api.use('/user', user());

    applyRouter(api, '/user/:userId/accessToken', accessToken())
    applyRouter(api, '/user/:userId/notification', notification())
    applyRouter(api, '/user', user())

    applyRouter(api, '/device/:deviceId/thing/:nodeId/state', thingState())
    applyRouter(api, '/device/:deviceId/thing/:nodeId/notify', notify())
    applyRouter(api, '/device/:deviceId/thing/:nodeId', thing())
    applyRouter(api, '/device', device())

    // api.use('/device/:deviceId/thing/:nodeId/state', thingState());
    // api.use('/device/:deviceId/thing/:nodeId/notify', notify());
    // api.use('/device/:deviceId/thing/:nodeId', thing());
    // api.use('/device', device());

    applyRouter(api, '/discovery', discovery())
    applyRouter(api, '/broker', broker())
    applyRouter(api, '/config', configApi(config))

    // api.use('/discovery', discovery());
    // api.use('/broker', broker());
    // api.use('/config', configApi(config));

    api.get('/config/notification', (ctx) => {
        ctx.body = { vapidPublicKey: config.notification.vapidPublicKey };
    });

    applyRouter(api, '/pushsubscriptionchange', subscriptionChange())

    // expose some API metadata at the root
    api.get('/', (ctx) => {
        ctx.body = { version: '2.0.0' };
    });

    return api;
};
