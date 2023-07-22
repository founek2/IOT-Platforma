import Agenda from 'agenda';
import { AGENDA_JOB_TYPE } from 'common/src/constants/agenda';
import subDays from 'date-fns/subDays';
import { logger } from 'common/src/logger';

export default function (agenda: Agenda) {
    agenda.define(AGENDA_JOB_TYPE.REMOVE_OLD_JOBS, async (job) => {
        logger.info('Runnning clean JOB');

        /* Remove successfull jobs of type SIGN_UP_EMAIL older than 30 days */
        await agenda.cancel({
            name: AGENDA_JOB_TYPE.SIGN_UP_EMAIL,
            lastRunAt: { $lt: subDays(new Date(), 30) },
        });
    });
}
