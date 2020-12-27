import eventEmitter from '../service/eventEmitter';
import init from '../subscribers';

export default async () => {
    init(eventEmitter)
};