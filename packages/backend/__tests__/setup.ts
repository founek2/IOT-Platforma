import { MongoMemoryServer } from 'mongodb-memory-server';
import config from 'common/lib/config/index';
import { logger } from 'framework-ui/lib/logger';

export default async function () {
    if (!config.dbUri) {
        logger.info('env DATABASE_URI not provided, spinning up in memory DB');
        const instance = await MongoMemoryServer.create({
            binary: {
                version: '4.4.4',
            },
        });
        const uri = instance.getUri('IOT_test');
        config.dbUri = uri;
        process.env.DATABASE_URI = uri;
        (global as any).__MONGOINSTANCE = instance;
    }
}
