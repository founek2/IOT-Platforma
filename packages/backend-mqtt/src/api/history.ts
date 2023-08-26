import resource from 'common/lib/middlewares/resource-router-middleware.js';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth.js';
import checkReadPerm from 'common/lib/middlewares/device/checkReadPerm.js';
import { InfluxService } from 'common/lib/services/influxService.js';

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
