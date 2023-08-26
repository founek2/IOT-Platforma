import bodyParser from 'body-parser';
import config from 'common/lib/config';
import { JwtService } from 'common/lib/services/jwtService.js';
import { connectMongoose } from 'common/lib/utils/connectMongoose.js';
import express from 'express';
import { logger } from 'common/lib/logger';
import morgan from 'morgan';
import api from './api/index.js';
import eventEmitter from './services/eventEmitter.js';
import initSubscribers from './subscribers/index.js';
import { Config } from './types.js';

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
