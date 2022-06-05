import { Router } from 'express';
import auth from './auth';
import actions from './actions';
import webSocket from './socket';
import { Server as serverIO } from 'socket.io';

export default ({ io }: { io: serverIO }) => {
    let api = Router();

    api.use('/auth', auth);

    api.use('/actions', actions);

    webSocket(io);
    return api;
};
