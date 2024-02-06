import { loadConfig } from './config';
import { logger } from 'common/lib/logger';
import mongoose from 'mongoose';
import { bindServer, MyApp } from './main';
import express from "express";
import { BusEmitter } from 'common/lib/interfaces/asyncEmitter';

const config = loadConfig();
const app = express();
bindServer(app, config, new BusEmitter());
/* Start server */
const server = app.listen(config.port, () => {
    logger.info(`Started on port ${config.port}`);
});

// handle appropriately server shutdown
process.once('SIGINT', shutDown(app, mongoose.connection));
process.once('SIGTERM', shutDown(app, mongoose.connection));
process.once('SIGHUP', shutDown(app, mongoose.connection));

function shutDown(app: express.Express, connection: mongoose.Connection) {
    return async (code: NodeJS.Signals) => {
        logger.info(code, 'received...');
        server.close();
        await connection.close();
        process.exit(0);
    };
}
