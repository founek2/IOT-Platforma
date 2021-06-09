import http from 'http';
import express, { Application } from 'express';
import config from 'common/lib/config';
import { JwtService } from 'common/lib/services/jwtService';
import { devLog } from 'framework-ui/lib/logger';
import { Config } from './types';
import loadersInit from './loaders';
import mongoose from 'mongoose';
import initPrivileges from 'framework-ui/lib/privileges';
import { groupsHeritage, allowedGroups } from 'common/lib/constants/privileges';
import { MailerService } from './services/mailerService';

export const routes = {
    user: {
        allowedGroups: allowedGroups.user,
    },
    admin: {
        allowedGroups: allowedGroups.admin,
    },
    root: {
        allowedGroups: allowedGroups.root,
    },
};

initPrivileges(routes, groupsHeritage);

interface customApp extends Application {
    server?: http.Server;
}

async function startServer(config: Config) {
    /* INITIALIZE */
    JwtService.init(config.jwt); // used in WebSocket middleware
    MailerService.init(config.email);

    const app: customApp = express();

    app.server = http.createServer(app);
    if (!app.server) throw Error('Unable to create server');

    await loadersInit({ app, config });
    /* --------- */

    /* SocketIO proxy just for development */
    if (process.env.NODE_ENV === 'development') {
        console.log('Socket redirect enabled');
        const proxy = require('http-proxy-middleware');
        var wsProxy = proxy('/socket.io', {
            target: 'ws://localhost:8084',
            changeOrigin: true, // for vhosted sites, changes host header to match to target's host
            ws: true, // enable websocket proxy
            logLevel: 'error',
        });

        app.use(wsProxy);
        app.server.on('upgrade', wsProxy.upgrade);
        devLog('Proxy enabled');
    }

    /* Start server */
    app.server.listen(config.port, () => {
        console.log(`Started on port ${(app.server?.address() as any).port}`);
    });

    // handle appropriately server shutdown
    process.once('SIGINT', shutDown(app, mongoose.connection));
    process.once('SIGTERM', shutDown(app, mongoose.connection));
    process.once('SIGHUP', shutDown(app, mongoose.connection));
}

function shutDown(app: customApp, connection: mongoose.Connection) {
    return async (code: NodeJS.Signals) => {
        console.log(code, 'received...');
        app.server?.close();
        await connection.close();
        process.exit(0);
    };
}

startServer(config);
