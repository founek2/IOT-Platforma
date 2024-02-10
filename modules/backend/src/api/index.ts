import { Router } from 'express';
import user from './user';
import device from './device';
import notify from './notify';
import discovery from './discovery';
import thing from './thing';
import thingState from './thingState';
import accessToken from './accessToken';
import subscriptionChange from './subscriptionChange';
import broker from './broker';
import configApi from './config';
import { Config } from '../config';
import notification from './notification';

export default ({ config }: { config: Config }) => {
    let api = Router();
    // mount the user resource
    api.use('/user/:userId/accessToken', accessToken());
    api.use('/user/:userId/notification', notification());
    api.use('/user', user());


    api.use('/device/:deviceId/thing/:nodeId/state', thingState());
    api.use('/device/:deviceId/thing/:nodeId/notify', notify());
    api.use('/device/:deviceId/thing/:nodeId', thing());
    api.use('/device', device());

    api.use('/discovery', discovery());

    api.use('/broker', broker());

    api.use('/config', configApi(config));

    api.get('/config/notification', (req, res) => {
        res.json({ vapidPublicKey: config.notification.vapidPublicKey });
    });

    api.use('/pushsubscriptionchange', subscriptionChange());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
