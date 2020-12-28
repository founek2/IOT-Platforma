import Agenda from "agenda";
import { AGENDA_JOB_TYPE } from "common/lib/constants/agenda"
import subDays from 'date-fns/subDays'
import logger from "framework-ui/lib/logger"

export default function (agenda: Agenda) {
    agenda.define(AGENDA_JOB_TYPE.REMOVE_OLD_JOBS, async job => {
        logger.info("Runnning clean JOB")
        await agenda.cancel({
            name: AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE,
            "lastRunAt": { $lt: subDays(new Date(), 2) }
        })

        await agenda.cancel({
            name: AGENDA_JOB_TYPE.SIGN_UP_EMAIL,
            "lastRunAt": { $lt: subDays(new Date(), 30) }
        })
    });

    // agenda.on(`fail:${AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE}`, (err, job) => {
    //     // TODO check which error happend -> than do stuff based on it
    //     logger.error(`Job failed with error: ${err.message}`);
    //     job.attrs.nextRunAt = new Date(Date.now() + 10 * 60 * 1000)
    //     job.save()
    // });
}; 