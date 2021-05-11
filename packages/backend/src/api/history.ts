import { HistoricalModel } from 'common/lib/models/historyModel';
import express from 'express';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import checkReadPerm from '../middlewares/device/checkReadPerm';

/**
 * URL prefix /device/:deviceId/thing/:thingId/history
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            read: [tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' })],
        },
        /** GET / - List all history data associated with provided thing of device in time period
         * @restriction user needs read permission
         * @header Authorization-JWT
         * @param {Date} from beggining of the time period
         * @param {Date} to end of the time period, default now
         * @return json { docs: IHistorical[] }
         */
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
