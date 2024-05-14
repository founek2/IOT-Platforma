import { HistoricalModel } from 'common/lib/models/historyModel';
import { Config } from '../config';

export async function up(config: Config) {
    await HistoricalModel.deleteMany({}).exec();
}

export async function down() { }
