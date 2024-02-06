import * as types from '../types';
import { AGENDA_JOB_TYPE } from 'common/lib/constants/agenda';
import Agenda from 'agenda';
import { Emitter } from 'common/src/emitter/typedEmitter';
import { BackendEmitter } from '../services/eventEmitter';

export default function (eventEmitter: BackendEmitter, agenda: Agenda) {
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
