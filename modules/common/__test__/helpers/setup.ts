import { MongoMemoryServer } from 'mongodb-memory-server';

export async function spawnDatabase(config: { dbUri: string }) {
    console.info('spinning up in memory DB');
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

    return instance;
}

export function getDatabaseInstace() {
    const instance: MongoMemoryServer | undefined = (global as any).__MONGOINSTANCE;
    return instance;
}