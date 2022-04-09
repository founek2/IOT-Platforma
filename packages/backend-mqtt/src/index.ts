import bodyParser from 'body-parser';
import config from 'common/lib/config';
import { InfluxService } from 'common/lib/services/influxService';
import { JwtService } from 'common/lib/services/jwtService';
import * as TemporaryPass from 'common/lib/services/TemporaryPass';
import { connectMongoose } from 'common/lib/utils/connectMongoose';
import express, { Application } from 'express';
import { logger } from 'framework-ui/lib/logger';
import http from 'http';
import morgan from 'morgan';
import { Server as serverIO } from 'socket.io';
import api from './api';
import eventEmitter from './services/eventEmitter';
import * as FireBase from './services/FireBase';
import { migrate } from './services/migrations';
import mqttService from './services/mqtt';
import initSubscribers from './subscribers';
import { Config } from './types';

interface customApp extends Application {
    server: http.Server;
    io: serverIO;
}

async function startServer(config: Config) {
    JwtService.init(config.jwt);
    FireBase.init(config);
    InfluxService.init(config.influxDb);

    initSubscribers(eventEmitter);

    await connectMongoose(config.dbUri);
    await migrate(config);

    // mongoose.set('debug', Number(process.env.LOG_LEVEL) >= LogLevel.SILLY);

    const appInstance = express();
    const server = http.createServer(appInstance);
    const app: customApp = Object.assign(appInstance, { server, io: new serverIO(server, { path: '/socket.io' }) });

    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    app.use('/api', (req, res, next) =>
        bodyParser.json({
            limit: '100kb',
        })(req, res, next)
    );

    app.use('/api', api({ io: app.io }));

    app.server.listen(config.portAuth, () => {
        logger.info(`Started on port ${(app.server?.address() as any).port}`);

        if (app.io) setTimeout(() => mqttService(app.io, config.mqtt, TemporaryPass.getPass), 1000); //init
    });
}

startServer(config);
