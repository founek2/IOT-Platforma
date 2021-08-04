import { allowedGroups, groupsHeritage } from 'common/lib/constants/privileges';
import { JwtService } from 'common/lib/services/jwtService';
import express, { Application } from 'express';
import { logger } from 'framework-ui/lib/logger';
import initPrivileges from 'framework-ui/lib/privileges';
import http from 'http';
import loadersInit from './loaders';
import { MailerService } from './services/mailerService';
import { Config } from './types';

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

    loadersInit({ app, config });
    /* --------- */

    /* SocketIO proxy just for development */
    if (process.env.NODE_ENV === 'development') {
        const proxy = require('http-proxy-middleware');
        var wsProxy = proxy('/socket.io', {
            target: 'ws://localhost:8084',
            changeOrigin: true, // for vhosted sites, changes host header to match to target's host
            ws: true, // enable websocket proxy
            logLevel: 'error',
        });

        app.use(wsProxy);
        app.server.on('upgrade', wsProxy.upgrade);
        logger.info('Proxy enabled');
    }
    return app;
}
export { createApp };

//     /* Start server */
//     app.server.listen(config.port, () => {
//         logger.info(`Started on port ${(app.server?.address() as any).port}`);
//     });

//     // handle appropriately server shutdown
//     process.once('SIGINT', shutDown(app, mongoose.connection));
//     process.once('SIGTERM', shutDown(app, mongoose.connection));
//     process.once('SIGHUP', shutDown(app, mongoose.connection));
// }

// function shutDown(app: customApp, connection: mongoose.Connection) {
//     return async (code: NodeJS.Signals) => {
//         console.log(code, 'received...');
//         app.server?.close();
//         await connection.close();
//         process.exit(0);
//     };
// }

// startServer(config);
