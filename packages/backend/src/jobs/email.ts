import Agenda from 'agenda';
import logger from 'framework-ui/lib/logger';
import { MailerService } from '../services/mailerService';
import { AGENDA_JOB_TYPE } from 'common/lib/constants/agenda';
import { UserBasic } from '../types';
import { IToken } from 'common/lib/models/tokenModel';

export default function (agenda: Agenda) {
    /* Send SignUp email */
    agenda.define(AGENDA_JOB_TYPE.SIGN_UP_EMAIL, async (job: Agenda.Job<{ user: UserBasic }>) => {
        logger.info('Runnning sign up email JOB', job.attrs.data);
        return MailerService.sendSignUp(job.attrs.data.user);
    });

    /* Schedule failed SignUp email */
    agenda.on(`fail:${AGENDA_JOB_TYPE.SIGN_UP_EMAIL}`, (err, job) => {
        // TODO check which error happend -> than do stuff based on it
        logger.error(`Job failed with error: ${err.message}`);
        job.attrs.nextRunAt = new Date(Date.now() + 120 * 60 * 1000);
        job.save();
    });

    /* Send email with link to change password to user account */
    agenda.define(
        AGENDA_JOB_TYPE.FORGOT_PASSWORD_EMAIL,
        async (job: Agenda.Job<{ user: UserBasic; token: IToken }>) => {
            logger.info('Runnning forgot password email JOB', job.attrs.data.token);
            return MailerService.sendForgotPassword(job.attrs.data.token.data, job.attrs.data.user);
        }
    );
}
