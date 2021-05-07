import Agenda from 'agenda';
import logger from 'framework-ui/lib/logger';
import Mailer from '../services/mailerService';
import { AGENDA_JOB_TYPE } from 'common/lib/constants/agenda';

const mailer = new Mailer();

export default function (agenda: Agenda) {
    agenda.define(AGENDA_JOB_TYPE.SIGN_UP_EMAIL, async (job) => {
        logger.info('Runnning sign up email JOB', job.attrs.data);
        return mailer.sendSignUp(job.attrs.data.user);
    });

    agenda.on(`fail:${AGENDA_JOB_TYPE.SIGN_UP_EMAIL}`, (err, job) => {
        // TODO check which error happend -> than do stuff based on it
        logger.error(`Job failed with error: ${err.message}`);
        job.attrs.nextRunAt = new Date(Date.now() + 10 * 60 * 1000);
        job.save();
    });

    agenda.define(AGENDA_JOB_TYPE.FORGOT_PASSWORD_EMAIL, async (job) => {
        logger.info('Runnning forgot password email JOB', job.attrs.data.token);
        return mailer.sendForgotPassword(job.attrs.data.token.data, job.attrs.data.user);
    });
}
