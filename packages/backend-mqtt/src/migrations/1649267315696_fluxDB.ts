import { Point } from '@influxdata/influxdb-client';
import { DeviceModel } from 'common/src/models/deviceModel';
import { HistoricalModel } from 'common/src/models/historyModel';
import { logger } from 'common/src/logger';
import { InfluxService } from 'common/src/services/influxService';
import { Config } from '../types';

export async function up(config: Config) {
    await InfluxService.deleteAndCreateBucket(config.influxDb.organization, config.influxDb.bucket);

    for await (const device of DeviceModel.find()) {
        for await (const history of HistoricalModel.find({ deviceId: device._id })) {
            const thing = device.things.find((thing) => thing._id.toString() === history.thingId.toString());
            if (!thing) return logger.error('Unable to find thing', history.thingId);

            const points: Point[] = [];
            Object.entries(history.properties).forEach(([propertyId, propHistory]) => {
                const property = thing.config.properties.find((property) => property.propertyId === propertyId);
                if (!property) return logger.error('Unable to find property', propertyId);

                for (const sample of propHistory.samples) {
                    const point = InfluxService.createMeasurement(
                        device._id.toString(),
                        device.info.name,
                        thing.config.nodeId,
                        property,
                        sample
                    );
                    points.push(point);
                }
            });

            InfluxService.saveMeasurements(points);
        }
    }
}

export async function down() { }
