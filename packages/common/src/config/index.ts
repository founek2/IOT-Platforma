import { Config } from '../types';
import { logger } from 'framework-ui/lib/logger';

var path = require('path');

function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

const pathRef = path.join(__dirname, areWeTestingWithJest() ? '../../../../.test.env' : '../../../../.env');
const finalPath = process.env.ENV_CONFIG_PATH ? process.env.ENV_CONFIG_PATH : path.resolve(pathRef);
require('dotenv').config({
    path: finalPath,
});
logger.info(`loading .env from ${finalPath}, env=${process.env.NODE_ENV}`);

const config: Config = {
    port: Number(process.env.PORT) || 8085,
    bodyLimit: process.env.BODY_LIMIT || '100kb',
    homepage: process.env.HOME_PAGE as string,
    portAuth: Number(process.env.AUTH_PORT) || 8084,
    firebaseAdminPath: process.env.FIREBASE_ADMIN_PATH as string,
    dbUri: process.env.DATABASE_URI as string,
    jwt: {
        privateKey: process.env.JWT_PRIVATE_KEY as string,
        publicKey: process.env.JWT_PUBLIC_KEY as string,
        expiresIn: process.env.JWT_EXPIRES_IN || '14d',
    },
    email: {
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        userName: process.env.EMAIL_USERNAME as string,
        password: process.env.EMAIL_PASSWORD as string,
    },
    agenda: {
        collection: 'agendaJobs',
        jobs: process.env.AGENDA_JOB_TYPES,
    },
    mqtt: {
        url: process.env.MQTT_URL as string,
        port: Number(process.env.MQTT_PORT) || 8883,
        managementPort: Number(process.env.MQTT_MANAGEMENT_PORT) || 15672,
    },
    oauth: {
        seznam: {
            clientSecret: process.env.OAUTH_SEZNAM_CLIENT_SECRET as string,
            clientId: process.env.OAUTH_SEZNAM_CLIENT_ID as string,
            redirectUri: process.env.OAUTH_REDIRECT_URI as string,
            iconUrl: '/images/seznamLogo.svg',
            endpoint: 'https://login.szn.cz/api/v1/oauth/auth',
            scopes: ['identity'],
        },
    },
};

export default config;
