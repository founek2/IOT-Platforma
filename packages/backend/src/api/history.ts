import { HistoricalModel } from 'common/lib/models/historyModel';
import express from 'express';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import checkReadPerm from '../middlewares/device/checkReadPerm';

export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            read: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })],
        },
        /** GET /:param - List all entities */
        async index({ params, query: { from, to } }, res) {
            const { deviceId, thingId } = params;
            console.log('par', params);
            const docs = await HistoricalModel.getData(
                deviceId,
                thingId,
                new Date(Number(from)),
                new Date(to ? Number(to) : new Date())
            );
            res.send({ docs });
        },
    });
