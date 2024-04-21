import { logger } from 'common/lib/logger';
import mongoLoader from './mongodb';
import subscribers from './subscribers';
import { init as initAgenda } from '../agenda'; // Agenda init
import { Config } from '../config';
import { Context } from '../types';

/* Load appropriate loaders */
export default async ({ config, context }: { config: Config, context: Context }) => {
    const mongoConnection = await mongoLoader(config);
    if (!mongoConnection) throw Error('Unable to connect to Mongo DB');

    const agenda = initAgenda(config, context.mailerService)
    subscribers(agenda, context.userService);

    logger.info('Loaders Intialized');
};
