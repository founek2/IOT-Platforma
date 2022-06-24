import { Router } from 'express';
import auth from './auth';
import pass from './pass';
import signIn from './signIn';
import signOut from './signOut';

export default ({}) => {
    let api = Router();

    api.use('/auth/rabbitmq', auth);

    api.use('/auth/temporaryPass', pass);

    api.use('/auth/user/signIn', signIn());

    api.use('/auth/user/signOut', signOut());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
