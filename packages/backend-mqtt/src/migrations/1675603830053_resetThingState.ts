import { DeviceModel } from 'common/lib/models/deviceModel.js';
import { Config } from '../types.js';

export async function up(config: Config) {
    await DeviceModel.updateMany(
        {},
        {
            $unset: { 'things.$[].state': 1 },
        }
    ).exec();
}

export async function down() { }
