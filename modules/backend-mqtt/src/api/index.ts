import { Router } from 'express';
import actions from './actions';
import webSocket from './socket';
import { Server as serverIO } from 'socket.io';
import history from './history';
import { Context } from '../types';

export default ({ io, context }: { io: serverIO, context: Context }) => {
    let api = Router();

    api.use('/device/:deviceId/thing/:thingId/history', history());

    api.use('/actions', actions);

    webSocket(io, context.jwtService);

    // expose some API metadata at the root
    api.get('/actions', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
