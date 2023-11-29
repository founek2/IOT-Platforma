import Agenda from 'agenda';
import { UserService } from 'common/lib/services/userService';
import eventEmitter from '../services/eventEmitter';
import init from '../subscribers';

/* Initialize event subscribers */
export default async (agenda: Agenda, userService: UserService) => {
    init(eventEmitter, agenda, userService);
};
