import { JwtService } from '@common/services/jwtService';
import express from 'express';
import { Server as serverIO, Socket } from 'socket.io';
import { logger } from 'framework-ui/lib/logger';

type socketWithUser = {
    request: { user?: { id: string } };
} & Socket;

/**
 * Handle for SocketIO
 */
export default (io: serverIO) => {
    /* Login middleware to authenticate using JWT token */
    io.use((socket: socketWithUser, next) => {
        let token = socket.handshake.query.token as string;
        JwtService.verify(token)
            .then((payload) => {
                socket.request.user = payload;
                next();
            })
            .catch(() => next());
    });

    io.on('connection', (socket: socketWithUser) => {
        logger.debug('New client connected', socket.request.user?.id || 'unknown');
        if (socket.request.user) {
            // if authenticated, then join the appropriate group
            socket.join(socket.request.user.id);
        }

        // default public group
        socket.join('public');

        socket.on('disconnect', () => {
            logger.debug('Client disconnected');
        });
    });

    return express.Router();
};
