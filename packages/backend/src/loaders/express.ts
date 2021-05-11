import express, { Application, Request } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import api from '../api';
import { Config } from '../types';

function getMaxSize(req: Request) {
    // if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '5mb'
    if (/^\/api\/device(\/|$)/.test(req.url) && (req.method == 'POST' || req.method == 'PUT')) return '5mb';
    return '100kb';
}

export default async ({ app, config }: { app: Application; config: Config }) => {
    app.disable('x-powered-by');

    // logger
    app.use('/api', morgan('dev') as any);

    // Security headers
    app.use(
        helmet({
            hsts: false,
            hidePoweredBy: false, // already disabled
        })
    );

    // decoder
    app.use(express.urlencoded({ extended: true }));

    // JSON parser
    app.use((req, res, next) =>
        bodyParser.json({
            limit: getMaxSize(req),
        })(req, res, next)
    );

    // mongo sanitizer (removes $ from keys)
    app.use(mongoSanitize());

    // 3rd party middleware
    // app.options("*", cors() as any);

    // const corsOptions = {
    //      origin: 'https://tracker.iotplatforma.cloud'
    // }
    // app.use(cors(corsOptions))

    // api router
    app.use('/api', api());

    app.use('/api/*', (req, res) => res.sendStatus(404));

    return app;
};
