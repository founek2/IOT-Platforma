import { Router } from 'express';
import auth from './auth';
import pass from './pass';
import signIn from './signIn';
import signOut from './signOut';
import refresh from './refreshToken';

export default ({ }) => {
    let api = Router();

    api.use('/rabbitmq', auth);

    api.use('/temporaryPass', pass);

    api.use('/user/signIn', signIn());

    api.use('/user/signIn/refresh', refresh());

    api.use('/user/signOut', signOut());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
