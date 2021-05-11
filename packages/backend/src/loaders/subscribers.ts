import eventEmitter from '../services/eventEmitter';
import init from '../subscribers';

/* Initialize event subscribers */
export default async () => {
    init(eventEmitter);
};
