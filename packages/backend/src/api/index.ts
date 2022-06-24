import { Router } from 'express';
import user from './user';
import device from './device';
import notify from './notify';
import discovery from './discovery';
import thing from './thing';
import accessToken from './accessToken';
import broker from './broker';
import { Config } from '../types';

export default ({ config }: { config: Config }) => {
    let api = Router();
    // mount the user resource
    api.use('/user', user());

    api.use('/user/:userId/accessToken', accessToken());

    api.use('/device/:deviceId/thing/:nodeId/notify', notify());

    api.use('/device', device());

    api.use('/device/:deviceId/thing/:nodeId', thing());

    api.use('/discovery', discovery());

    api.use('/broker', broker());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    api.use('/*', (req, res) => res.sendStatus(404));

    return api;
};
