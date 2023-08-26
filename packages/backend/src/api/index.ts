import { Router } from 'express';
import user from './user.js';
import device from './device.js';
import notify from './notify.js';
import discovery from './discovery.js';
import thing from './thing.js';
import thingState from './thingState.js';
import accessToken from './accessToken.js';
import broker from './broker.js';
import { Config } from '../types/index.js';

export default ({ config }: { config: Config }) => {
    let api = Router();
    // mount the user resource
    api.use('/user', user());

    api.use('/user/:userId/accessToken', accessToken());

    api.use('/device/:deviceId/thing/:nodeId/notify', notify());

    api.use('/device', device());

    api.use('/device/:deviceId/thing/:nodeId', thing());
    api.use('/device/:deviceId/thing/:nodeId/state', thingState());

    api.use('/discovery', discovery());

    api.use('/broker', broker());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    api.use('/*', (req, res) => res.sendStatus(404));

    return api;
};
