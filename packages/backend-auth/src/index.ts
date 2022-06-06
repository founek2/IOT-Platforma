import bodyParser from 'body-parser';
import config from 'common/src/config';
import { JwtService } from 'common/src/services/jwtService';
import { connectMongoose } from 'common/src/utils/connectMongoose';
import express, { Application, RequestHandler } from 'express';
import { logger } from 'framework-ui/src/logger';
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

    app.use(function (req, res, next) {
        console.log('path', req.path);
        next();
    });

    app.use(morgan('dev') as RequestHandler);
    app.use(express.urlencoded({ extended: true }) as RequestHandler);

    app.use('/api', bodyParser.json({ limit: '100kb' }) as RequestHandler);

    app.use('/api', api({}));

    app.listen(config.portAuth, () => {
        logger.info(`Started on port ${config.portAuth}`);
    });
}

startServer(config);
