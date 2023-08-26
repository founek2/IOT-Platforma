import agenda from '../agenda.js';
import { Emitter } from '../services/eventEmitter.js';
import * as types from '../types/index.js';
import { AGENDA_JOB_TYPE } from 'common/lib/constants/agenda.js';

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
    eventEmitter.on('device_control_recipe_change', async ({ recipes, deviceId }) => {
        await agenda.cancel({ name: AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE, 'data.deviceId': deviceId });
        if (recipes.length === 0) return;

        const job = agenda.create(AGENDA_JOB_TYPE.CHECK_ONLINE_DEVICE, { recipes, deviceId });
        job.repeatEvery('4 minutes');
        job.save();
    });

    eventEmitter.on('device_delete', async (deviceId) => {
        agenda.cancel({ 'data.deviceId': deviceId });
    });
}
