import Agenda from 'agenda';
import * as types from './types'
import config from './config'
import createMongoUri from './lib/createMongoUri'
import logger from 'framework-ui/lib/logger'

const agendaConfig = config.agenda

const connectionOpts = {
    db: {
        address: createMongoUri(agendaConfig), collection: 'agendaJobs', options: {
            useUnifiedTopology: true
        }
    }
};

const agenda = new Agenda(connectionOpts);

const jobTypes = agendaConfig.jobs ? agendaConfig.jobs.split(',') : [];
logger.debug("loading jobs: %s", jobTypes)

jobTypes.forEach(async type => {
    const job = require('./jobs/' + type) as { default: (agenda: Agenda) => void }
    job.default(agenda)
});

agenda.processEvery("one minute")

agenda.on('start', job => {
    logger.debug('Job %s starting', job.attrs.name);
});

if (jobTypes.length) {
    (async () => {
        await agenda.start();
    })()
}

export default agenda
