import { Router } from 'express';
import user from './user';
import device from './device';
import notify from './notify';
import discovery from './discovery';
import thing from './thing';
import thingState from './thingState';
import accessToken from './accessToken';
import notification from './notification';
import broker from './broker';
import configApi from './config';
import { Config } from '../types';

export default ({ config }: { config: Config }) => {
    let api = Router();
    // mount the user resource
    api.use('/user', user());
    api.use('/user/:userId/accessToken', accessToken());
    api.use('/user/:userId/notification', notification());


    api.use('/device', device());
    api.use('/device/:deviceId/thing/:nodeId', thing());
    api.use('/device/:deviceId/thing/:nodeId/state', thingState());
    api.use('/device/:deviceId/thing/:nodeId/notify', notify());

    api.use('/discovery', discovery());

    api.use('/broker', broker());

    api.use('/config', configApi(config));

    api.get('/config/notification', (req, res) => {
        res.json({ vapidPublicKey: config.notification.vapidPublicKey });
    });


    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    api.use('/*', (req, res) => res.sendStatus(404));

    return api;
};
