import eventEmitter from '../services/eventEmitter.js';
import init from '../subscribers/index.js';

/* Initialize event subscribers */
export default async () => {
    init(eventEmitter);
};
