import bodyParser from 'body-parser';
import config from './config';
import { JwtService } from 'common/lib/services/jwtService';
import { connectMongoose } from 'common/lib/utils/connectMongoose';
import express, { Application } from 'express';
import { logger } from 'common/lib/logger';
import http from 'http';
import morgan from 'morgan';
import { Server as serverIO } from 'socket.io';
import api from './api';
import eventEmitter from './services/eventEmitter';
import initSubscribers from './subscribers';
import { Config } from './types';

interface customApp extends Application {
    server: http.Server;
    io: serverIO;
}

async function startServer(config: Config) {
    JwtService.init(config.jwt);

    initSubscribers(eventEmitter);

    await connectMongoose(config.dbUri);

    // mongoose.set('debug', Number(process.env.LOG_LEVEL) >= LogLevel.SILLY);

    const app = express();

    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', bodyParser.json({ limit: '100kb' }));

    app.use('/api', api({}));

    app.listen(config.portAuth, () => {
        logger.info(`Started on port ${config.portAuth}`);
    });
}

startServer(config);
