import { Point } from '@influxdata/influxdb-client';
import { DeviceModel } from 'common/lib/models/deviceModel';
import { HistoricalModel } from 'common/lib/models/historyModel';
import { logger } from 'common/lib/logger';
import { InfluxService } from 'common/lib/services/influxService';
import { Config } from '../types';

export async function up(config: Config) {
    await DeviceModel.updateMany(
        {},
        {
            $unset: { 'things.$[].state': 1 },
        }
    ).exec();
}

export async function down() { }
