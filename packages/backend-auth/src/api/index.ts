import { Router } from 'express';
import auth from './auth';
import pass from './pass';

export default ({}) => {
    let api = Router();

    api.use('/auth/rabbitmq', auth);

    api.use('/auth/rabbitmq', pass);

    return api;
};
