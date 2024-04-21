import { loadConfig } from './config';
import { logger } from 'common/lib/logger';
import mongoose from 'mongoose';
import { bindServer } from './main';
import { BusEmitter } from 'common/lib/interfaces/asyncEmitter';
import Koa from "koa"
import http from "http"
import { AddressInfo } from 'net';
import Router from '@koa/router';
import { Context } from './types/index';

const config = loadConfig();
const app = new Koa();
const server = http.createServer(app.callback());
const router = new Router<Koa.DefaultState, Context>()

bindServer(router, config, new BusEmitter());
/* Start server */
server.listen(config.port, () => {
    const addr = server.address() as AddressInfo;
    logger.info(`Started on port http://${addr.address}:${addr.port}`);
})

app.use(router.routes())
app.use(router.allowedMethods())