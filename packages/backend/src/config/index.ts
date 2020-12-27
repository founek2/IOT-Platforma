import { Config } from "../types";

var path = require('path');

const pathRef = path.join(__dirname, "../../.env")
const finalPath = process.env.ENV_CONFIG_PATH ? process.env.ENV_CONFIG_PATH : path.resolve(pathRef)
require('dotenv').config({
    path: finalPath
})
console.log("loading .env from", finalPath)

const config: Config = {
    port: Number(process.env.PORT) || 8085,
    bodyLimit: process.env.BODY_LIMIT || "100kb",
    homepage: process.env.HOME_PAGE as string,
    imagesPath: process.env.IMAGES_PATH as string,
    firebaseAdminPath: process.env.FIREBASE_ADMIN_PATH as string,
    portAuth: Number(process.env.AUTH_PORT) || 8084,
    db: {
        userName: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
        dbName: process.env.DATABASE_NAME || "IOTPlatform",
        url: process.env.DATABASE_URL || "localhost",
        port: Number(process.env.DATABASE_PORT) || 27017,
    },
    jwt: {
        privateKey: process.env.JWT_PRIVATE_KEY as string,
        publicKey: process.env.JWT_PUBLIC_KEY as string,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    },
    mqtt: {
        port: Number(process.env.MQTT_PORT) || 8883,
        userName: process.env.MQTT_USERNAME as string,
        password: process.env.MQTT_PASSWORD as string,
    },
    testUser: "test1",
    testPassword: "123456",
    email: {
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        userName: process.env.EMAIL_USERNAME as string,
        password: process.env.EMAIL_PASSWORD as string,
    },
    agenda: {
        url: process.env.AGENDA_DB_URI || "localhost",
        port: Number(process.env.AGENDA_DB_PORT) || 27017,
        dbName: process.env.AGENDA_DB_NAME || "agenda-db",
        userName: process.env.AGENDA_DB_USERNAME || "test",
        password: process.env.AGENDA_DB_PASSWORD || "test",
        jobs: process.env.AGENDA_JOB_TYPES
    }
}

export default config