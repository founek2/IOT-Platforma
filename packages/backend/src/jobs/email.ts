import Agenda from "agenda";
import logger from 'framework-ui/lib/logger';
import Mailer from '../service/mailer';


const mailer = new Mailer()

export default function (agenda: Agenda) {
    agenda.define('registration email', async job => {
        console.log("data", job.attrs.data)
        await mailer.sendSignUp(job.attrs.data.user);
    });

    agenda.on('fail:registration email', (err, job) => {
        // TODO check which error happend -> than do stuff based on it
        logger.error(`Job failed with error: ${err.message}`);
        job.attrs.nextRunAt = new Date(Date.now() + 10 * 60 * 1000)
        job.save()
    });
};