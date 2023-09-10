import { JwtService } from 'common/lib/services/jwtService';
import express, { Application } from 'express';
import { logger } from 'common/lib/logger';
import http from 'http';
import loadersInit from './loaders';
import { MailerService } from './services/mailerService';
import { Config } from './types';

export interface MyApp extends Application {
    server: http.Server;
}

function createApp(config: Config) {
    /* INITIALIZE */
    JwtService.init(config.jwt); // used in WebSocket middleware
    MailerService.init(config.email);

    const expressApp = express();
    const app: MyApp = Object.assign(expressApp, { server: http.createServer(expressApp) });

    if (!app.server) throw Error('Unable to create server');

    /* SocketIO proxy*/

    const { createProxyMiddleware } = require('http-proxy-middleware');
    // const proxy = require('http-proxy-middleware');
    var mqttProxy = createProxyMiddleware({
        target: config.serviceMqttUri,
        changeOrigin: true, // for vhosted sites, changes host header to match to target's host
        ws: true, // enable websocket proxy
        logLevel: 'error',
    });
    app.use('/socket.io', mqttProxy);
    app.use('/api/device/:deviceId/thing/:thingId/history', mqttProxy);
    app.server.on('upgrade', mqttProxy.upgrade);

    const authProxy = createProxyMiddleware({
        target: config.serviceAuthUri,
        changeOrigin: true,
        logLevel: 'error',
    });
    app.use('/api/auth/rabbitmq', authProxy);
    app.use('/api/auth/user', authProxy);

    logger.info('Proxy enabled');

    loadersInit({ app, config });

    return app;
}
export { createApp };
