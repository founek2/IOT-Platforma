import { Application } from 'express';
import { logger } from 'common/lib/logger';
import expressLoader from './express';
import mongoLoader from './mongodb';
import subscribers from './subscribers';
import { init as initAgenda } from '../agenda'; // Agenda init
import { Config } from '../config';
import { Context } from '../types';

/* Load appropriate loaders */
export default async ({ app, config, context }: { app: Application; config: Config, context: Context }) => {
    const mongoConnection = await mongoLoader(config);
    if (!mongoConnection) throw Error('Unable to connect to Mongo DB');

    const agenda = initAgenda(config, context.mailerService)
    subscribers(agenda, context.userService);

    await expressLoader({ app, config, context });
    logger.info('Loaders Intialized');
};
