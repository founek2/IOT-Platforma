import config from 'common/lib/config';
import { logger } from 'framework-ui/lib/logger';
import mongoose from 'mongoose';
import { createApp, MyApp } from './main';

const app = createApp(config);
/* Start server */
app.server.listen(config.port, () => {
    logger.info(`Started on port ${(app.server?.address() as any).port}`);
});

// handle appropriately server shutdown
process.once('SIGINT', shutDown(app, mongoose.connection));
process.once('SIGTERM', shutDown(app, mongoose.connection));
process.once('SIGHUP', shutDown(app, mongoose.connection));

function shutDown(app: MyApp, connection: mongoose.Connection) {
    return async (code: NodeJS.Signals) => {
        console.log(code, 'received...');
        app.server.close();
        await connection.close();
        process.exit(0);
    };
}
