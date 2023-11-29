import { Application } from 'express';
import api from '../api';
import api2 from '../api/v2';
import { Config } from '../config';
import { Context } from '../types';


export default async ({ app, config, context }: { app: Application; config: Config, context: Context }) => {
    app.disable('x-powered-by');

    app.use((req: any, res, next) => {
        req.context = context
        next()
    })

    // JSON parser with limited body size
    // app.use(sizeLimitter as RequestHandler);

    // api router
    app.use('/api/v2', api2({ config }));

    app.use('/api', api({ config }));

    return app;
};
