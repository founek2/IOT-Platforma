import express, { Express } from 'express';
import { OAuthService } from './services/oauthService';
import initSubscribers from './subscribers';
import { connectMongoose } from 'common/lib/utils/connectMongoose';
import eventEmitter from './services/eventEmitter';
import { Config } from './config';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import { Context } from './types';
import { JwtService } from 'common';
import { UserService } from 'common';

export * from "./config"
export async function bindServer(app: Express, config: Config) {
    /* INITIALIZE */
    const jwtService = new JwtService(config.jwt); // used in WebSocket middleware
    const userService = new UserService(jwtService)
    const oauthService = new OAuthService(config.oauth); // used in WebSocket middleware
    const context: Context = {
        oauthService,
        userService,
        jwtService,
    }

    initSubscribers(eventEmitter);

    await connectMongoose(config.dbUri);

    app.use("/api/auth", (req: any, res, next) => {
        req.context = context
        next()
    })

    app.use("/api/auth", morgan('dev'));
    app.use('/api/auth', bodyParser.json({ limit: '100kb' }));
    app.use('/api/auth', api({ context }));

    return app
}