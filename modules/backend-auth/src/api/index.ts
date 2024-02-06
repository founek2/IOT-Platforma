import { Router } from 'express';
import auth from './auth';
import signIn from './signIn';
import signOut from './signOut';
import activeSignIn from './activeSignIn';
import refresh from './refreshToken';

export default ({ }) => {
    let api = Router();

    api.use('/rabbitmq', auth());

    api.use('/user/signIn/refresh', refresh());
    api.use('/user/signIn/active', activeSignIn());
    api.use('/user/signIn', signIn());

    api.use('/user/signOut', signOut());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
