import { Router } from 'express';
import actions from './actions';
import webSocket from './socket';
import { Server as serverIO } from 'socket.io';
import history from './history';
import { Context } from '../types';
import { BusEmitterType } from 'common/lib/interfaces/asyncEmitter';

export default ({ io, context, bus }: { io: serverIO, context: Context, bus: BusEmitterType }) => {
    let api = Router();

    api.use('/device/:deviceId/thing/:thingId/history', history());

    // api.use('/actions', actions({bus}));
    actions({ bus });

    webSocket(io, context.jwtService);

    // expose some API metadata at the root
    api.get('/actions', (req, res) => {
        res.json({ version: '2.0.0' });
    });

    return api;
};
