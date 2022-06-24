import express, { Application, Request, RequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import api from '../api';
import api2 from '../api/v2';
import { Config } from '../types';
import path from 'path';

function getMaxSize(req: Request) {
    // if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '5mb'
    if (/^\/api\/device(\/|$)/.test(req.url) && (req.method == 'POST' || req.method == 'PUT')) return '5mb';
    return '100kb';
}

const sizeLimitter: RequestHandler = (req, res, next) => {
    bodyParser.json({
        limit: getMaxSize(req),
    })(req, res as any, next);
};
export default async ({ app, config }: { app: Application; config: Config }) => {
    app.disable('x-powered-by');

    // logger
    if (process.env.NODE_ENV !== 'test') app.use(morgan('dev') as RequestHandler);

    // decoder
    app.use(express.urlencoded({ extended: true }) as RequestHandler);

    // JSON parser with limited body size
    app.use(sizeLimitter as RequestHandler);

    // server static frontend files
    const frontend_path = path.join(__dirname, '../../../frontend/build');
    app.use(express.static(frontend_path));

    // mongo sanitizer (removes $ from keys)
    app.use('/api', mongoSanitize());

    // api router
    app.use('/api/v2', api2({ config }));

    app.use('/api', api({ config }));

    // fallback
    app.get('/*', (req, res) => res.sendFile(path.join(frontend_path, 'index.html')));
    return app;
};
