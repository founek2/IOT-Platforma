import bodyParser from 'body-parser';
import config from 'common/src/config';
import { InfluxService } from 'common/src/services/influxService';
import { JwtService } from 'common/src/services/jwtService';
import { connectMongoose } from 'common/src/utils/connectMongoose';
import express, { Application } from 'express';
import { logger } from 'framework-ui/src/logger';
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
import { AuthConnector } from 'common/src/connectors/authConnector';

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

    app.server.listen(config.portMqtt, () => {
        logger.info(`Started on port ${(app.server?.address() as any).port}`);

        if (app.io) setTimeout(() => mqttService(app.io, config.mqtt, AuthConnector(config.authUri).getPass), 1000); //init
    });
}

startServer(config);
