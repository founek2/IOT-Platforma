import Agenda from "agenda";
import logger from 'framework-ui/lib/logger';
import DeviceHandler from '../../../common/src/service/DeviceHandler';
import { AGENDA_JOB_TYPE } from "common/lib/constants/agenda"
import { ControlRecipe } from "common/lib/types";
import Device from "backend/dist/models/Device"
import { publish } from "../service/mqtt";

export default function (agenda: Agenda) {
    agenda.define(AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE, { concurrency: 10 }, async job => {
        console.log("data", job.attrs.data)
        job.attrs.data.recipes.forEach(async (recipe: ControlRecipe) => {
            const isOnline = await DeviceHandler.handleIsOnline(recipe);
            if (!isOnline) return;

            const doc = await (Device as any).getTopicByID(job.attrs.data.deviceId)
            publish(`/${doc.createdBy}${doc.topic}/ack`, { ack: 1 })
        })

    });

    // agenda.on(`fail:${AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE}`, (err, job) => {
    //     // TODO check which error happend -> than do stuff based on it
    //     logger.error(`Job failed with error: ${err.message}`);
    //     job.attrs.nextRunAt = new Date(Date.now() + 10 * 60 * 1000)
    //     job.save()
    // });
};