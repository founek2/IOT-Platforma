import { Application } from 'express';
import { logger } from 'common/lib/logger';
import type * as types from '../types/index.js';
import expressLoader from './express.js';
import mongoLoader from './mongodb.js';
import subscribers from './subscribers.js';
import '../agenda'; // Agenda init

/* Load appropriate loaders */
export default async ({ app, config }: { app: Application; config: types.Config }) => {
    const mongoConnection = await mongoLoader(config);
    if (!mongoConnection) throw Error('Unable to connect to Mongo DB');

    subscribers();

    await expressLoader({ app, config });
    logger.info('Loaders Intialized');
};
