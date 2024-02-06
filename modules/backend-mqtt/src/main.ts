import express, { Express } from 'express';
import initSubscribers from './subscribers';
import { connectMongoose } from 'common/lib/utils/connectMongoose';
import eventEmitter from './services/eventEmitter';
import { Config } from './config';
import api from './api';
import { Context } from './types';
import { JwtService, InfluxService } from 'common';
import { Server } from 'http';
import { Server as serverIO } from 'socket.io';
import { MqttService } from './services/mqtt';
import { NotificationService } from './services/NotificationService';
import { Just } from 'purify-ts';
import { BusEmitterType, PassKeeper } from 'common/lib/interfaces/asyncEmitter';

export * from "./config"
export async function bindServer(app: Express, config: Config, bus: BusEmitterType, server: Server) {
    /* INITIALIZE */
    const jwtService = new JwtService(config.jwt); // used in WebSocket middleware
    const influxService = new InfluxService(config.influxDb)
    const notificationService = new NotificationService({
        publicVapidKey: config.notification.vapidPublicKey,
        privateVapidKey: config.notification.vapidPrivateKey,
        emailVapid: config.notification.vapidEmail,
        homepageUrl: config.homepage
    })
    const mqttService = new MqttService(config.mqtt, notificationService, influxService);
    const passKeper = new PassKeeper(bus);
    const context: Context = {
        jwtService,
        influxService,
        mqttService
    }

    initSubscribers(eventEmitter, context.mqttService);

    await connectMongoose(config.dbUri);

    const io = new serverIO(server, { path: '/socket.io' });

    app.use("/api", (req: any, res, next) => {
        req.context = context
        next()
    })
    app.use('/api', api({ io, context }));

    const { userName, password } = config.mqtt;
    const getPass = userName && password ? () => Just({ userName, password }) : passKeper.getPass

    setTimeout(() => {
        mqttService.connect(io, getPass)
    }, 1000)

    return Object.assign(app, { io })
}