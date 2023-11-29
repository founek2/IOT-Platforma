import Agenda from 'agenda';
import { Config } from './config';
import { AGENDA_JOB_TYPE } from 'common/lib/constants/agenda';
import { logger } from 'common';
import { MailerService } from './services/mailerService';


export function init(config: Config, mailerService: MailerService) {
    const configAgenda = config.agenda;
    const connectionOpts = {
        db: {
            address: config.dbUri,
            collection: configAgenda.collection,
            options: {
                useUnifiedTopology: true,
            },
        },
    };

    const agenda = new Agenda(connectionOpts);

    const jobTypes = configAgenda.jobs ? configAgenda.jobs.split(',') : [];
    logger.debug('loading jobs:', jobTypes);

    jobTypes.forEach(async (type: string) => {
        const job = require('./jobs/' + type) as { default: (agenda: Agenda, mailerService: MailerService) => void };
        job.default(agenda, mailerService);
    });

    agenda.processEvery('one minute');

    agenda.on('start', (job) => {
        logger.debug('Job', job.attrs.name, 'starting');
    });
    if (jobTypes.length) {
        (async () => {
            await agenda.start();

            agenda.every('24 hours', AGENDA_JOB_TYPE.REMOVE_OLD_JOBS);
        })();
    }

    return agenda
}


