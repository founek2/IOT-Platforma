import express, { Application, Request } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import api from '../api';
import { Config } from '../types';
import path from 'path';

function getMaxSize(req: Request) {
    // if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '5mb'
    if (/^\/api\/device(\/|$)/.test(req.url) && (req.method == 'POST' || req.method == 'PUT')) return '5mb';
    return '100kb';
}

export default async ({ app, config }: { app: Application; config: Config }) => {
    app.disable('x-powered-by');

    // logger
    if (process.env.NODE_ENV !== 'test') app.use('/api', morgan('dev') as any);

    // Security headers
    // app.use(
    //     helmet({
    //         hsts: false,
    //         hidePoweredBy: false, // already disabled
    //     })
    // );

    // decoder
    app.use(express.urlencoded({ extended: true }));

    // JSON parser with limited body size
    app.use((req, res, next) =>
        bodyParser.json({
            limit: getMaxSize(req),
        })(req, res, next)
    );

    // server static frontend files
    app.use(express.static(path.join(__dirname, '../../../frontend/build')));

    // mongo sanitizer (removes $ from keys)
    app.use('/api', mongoSanitize());

    // const corsOptions = {
    //      origin: 'https://tracker.iotplatforma.cloud'
    // }
    // app.use(cors(corsOptions))

    // api router
    app.use('/api', api());

    // fallback
    app.use('/api/*', (req, res) => res.sendStatus(404));

    return app;
};
