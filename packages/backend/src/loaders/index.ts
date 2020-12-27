import { Application } from 'express';
import logger from 'framework-ui/lib/logger';
import "../agenda"; // Agenda init
import * as types from '../types';
import expressLoader from './express';
import mongoLoader from './mongodb';
import subscribers from './subscribers';

export default async ({ app, config }: { app: Application, config: types.Config }) => {
    const mongoConnection = await mongoLoader(config);
    if (!mongoConnection) throw Error("Unable to connect to DB")

    subscribers()

    await expressLoader({ app, config });
    logger.info('Loaders Intialized');
}