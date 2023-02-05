import { Point } from '@influxdata/influxdb-client';
import { DeviceModel } from 'common/src/models/deviceModel';
import { HistoricalModel } from 'common/src/models/historyModel';
import { logger } from 'framework-ui/src/logger';
import { InfluxService } from 'common/src/services/influxService';
import { Config } from '../types';

export async function up(config: Config) {
    await DeviceModel.updateMany(
        {},
        {
            $unset: { 'things.$[].state': 1 },
        }
    ).exec();
}

export async function down() {}
