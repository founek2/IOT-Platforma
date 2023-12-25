import { Router } from 'express';
import { Config } from '../../config';
import thing from './thing';
import property from './property';
import thingState from './thingState';

export default ({ config }: { config: Config }) => {
    let api = Router();
    // mount the user resource
    api.use('/realm/:realm/device/:deviceId/thing/:nodeId/state', thingState());
    api.use('/realm/:realm/device/:deviceId/thing/:nodeId', thing());
    api.use('/realm/:realm/device/:deviceId/thing/:nodeId/property/:propertyId/state', property());

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
