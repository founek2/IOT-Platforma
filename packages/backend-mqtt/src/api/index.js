import { Router } from 'express';
import auth from './auth';
import actions from './actions';
import webSocket from './socket';

export default ({ io }) => {
    let api = Router();

    api.use('/auth', auth);

    api.use('/actions', actions);

    webSocket(io);
    return api;
};
