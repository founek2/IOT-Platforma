import { MongoMemoryServer } from 'mongodb-memory-server';
// import config from 'common/lib/config/index';
import { logger } from 'common/lib/logger';
import { bindServer } from '../../src/main';
import config from "../resources/config";
import express from "express"

export default async function () {
    console.log("loading")
    if (process.env.SPAWN_DATABASE) {
        logger.info('env DATABASE_URI not provided, spinning up in memory DB');
        const instance = await MongoMemoryServer.create({
            binary: {
                version: '4.4.4',
            },
        });
        const uri = instance.getUri('IOT_test');
        config.dbUri = uri;
        process.env.DATABASE_URI = uri;
        config.dbUri = uri;
        (global as any).__MONGOINSTANCE = instance;
    }

    (global as any).__app = await bindServer(express(), config);
}
