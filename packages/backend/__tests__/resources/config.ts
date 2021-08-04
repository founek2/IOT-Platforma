import config from 'common/lib/config';

export default {
    url: `localhost:${config.port}`,
    ...config,
};
