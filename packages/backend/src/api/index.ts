import { Router } from 'express';
import user from './user';
import device from './device';
import notify from './notify';
import discovery from './discovery';
import history from './history';
import thing from './thing';
import accessToken from './accessToken';

export default () => {
    let api = Router();
    // mount the user resource
    api.use('/user', user());

    api.use('/user/:userId/accessToken', accessToken());

    api.use('/device/:deviceId/thing/:nodeId/notify', notify());

    api.use('/device', device());

    api.use('/device/:deviceId/thing/:thingId/history', history());

    api.use('/device/:deviceId/thing/:thingId', thing());

    api.use('/discovery', discovery());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '0.2.0' });
    });

    return api;
};
