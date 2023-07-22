import agenda from '../agenda';
import { Emitter } from '../services/eventEmitter';
import * as types from '../types';
import { AGENDA_JOB_TYPE } from 'common/src/constants/agenda';
import { UserService } from 'common/src/services/userService';
import { logger } from 'common/src/logger';

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
    eventEmitter.on('user_login', async (user) => {
        logger.debug('user_login', user.info.userName);
    });

    eventEmitter.on('user_signup', async (user: types.UserBasic) => {
        if (user.info.email) agenda.now(AGENDA_JOB_TYPE.SIGN_UP_EMAIL, { user });
    });

    eventEmitter.on('user_forgot', async ({ email }) => {
        (await UserService.forgotPassword(email)).ifRight((result) =>
            agenda.now(AGENDA_JOB_TYPE.FORGOT_PASSWORD_EMAIL, { user: result.user, token: result.token })
        );
    });
}
