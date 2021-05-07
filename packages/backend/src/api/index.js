import { Router } from 'express';
import user from './user';
import device from './device';
// import auth from './auth';
import notify from './notify';
import discovery from './discovery';
import history from './history';
import thing from './thing';
import { version } from '../../package.json';

export default ({ config }) => {
    let api = Router();
    // mount the user resource
    api.use('/user', user());

    api.use('/device/:deviceId/thing/:nodeId/notify', notify());

    api.use('/device', device());

    api.use('/device/:deviceId/thing/:thingId/history', history());

    api.use('/device/:deviceId/thing/:thingId', thing());

    api.use('/discovery', discovery());

    // api.use('/auth', auth({ config }));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version });
    });

    return api;
};
