import config from '@common/config';

export default {
    url: `localhost:${config.port}`,
    ...config,
};
