import { Router } from 'express';
import auth from './auth';
import pass from './pass';
import user from './user';

export default ({}) => {
    let api = Router();

    api.use('/auth/rabbitmq', auth);

    api.use('/auth/temporaryPass', pass);

    api.use('/auth/user', user());

    return api;
};
