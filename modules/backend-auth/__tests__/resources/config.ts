import path from 'path';
import { loadConfig } from '../../src/config';

const config = loadConfig(path.join(__dirname, '.env.test'));
export default {
    url: `localhost:${config.portAuth}`,
    ...config,
};
