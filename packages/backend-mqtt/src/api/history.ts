import { HistoricalModel } from 'common/src/models/historyModel';
import express from 'express';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import checkReadPerm from 'common/src/middlewares/device/checkReadPerm';
import { InfluxService } from 'common/src/services/influxService';

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

            const rows = await InfluxService.getMeasurements(
                deviceId,
                thingId,
                new Date(Number(from)),
                new Date(to ? Number(to) : new Date())
            );

            // const docs = await HistoricalModel.getData(
            //     deviceId,
            //     thingId,
            //     new Date(Number(from)),
            //     new Date(to ? Number(to) : new Date())
            // );
            res.send({ docs: rows });
        },
    });
