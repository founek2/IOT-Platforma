import { DeviceModel } from 'common/lib/models/deviceModel';
import { Config } from '../config';

export async function up(config: Config) {
    await DeviceModel.updateMany(
        {},
        {
            $unset: { 'things.$[].state': 1 },
        }
    ).exec();
}

export async function down() { }
