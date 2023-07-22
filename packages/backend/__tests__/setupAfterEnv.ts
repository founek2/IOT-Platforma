import DatabaseHelper from './helpers/database';
import prepareDb from './helpers/prepareDb';
import config from 'common/lib/config/index';

beforeAll(async () => {
    await DatabaseHelper.connect(config.dbUri);
    await DatabaseHelper.truncate();
    return prepareDb();
});

afterAll(async () => {
    await DatabaseHelper.disconnect();
});
