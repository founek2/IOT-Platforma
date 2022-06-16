import { Router } from 'express';
import actions from './actions';
import webSocket from './socket';
import { Server as serverIO } from 'socket.io';
import history from './history';

export default ({ io }: { io: serverIO }) => {
    let api = Router();

    api.use('/device/:deviceId/thing/:thingId/history', history());

    api.use('/actions', actions);

    webSocket(io);

    // expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
