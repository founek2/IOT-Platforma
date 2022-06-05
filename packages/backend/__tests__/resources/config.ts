import config from 'common/src/config';

export default {
    url: `localhost:${config.port}`,
    ...config,
};
