import { Application } from 'express';
import { logger } from 'framework-ui/lib/logger';
import type * as types from '../types';
import expressLoader from './express';
import mongoLoader from './mongodb';
import subscribers from './subscribers';
import '../agenda'; // Agenda init

/* Load appropriate loaders */
export default async ({ app, config }: { app: Application; config: types.Config }) => {
    const mongoConnection = await mongoLoader(config);
    if (!mongoConnection) throw Error('Unable to connect to Mongo DB');

    subscribers();

    await expressLoader({ app, config });
    logger.info('Loaders Intialized');
};
