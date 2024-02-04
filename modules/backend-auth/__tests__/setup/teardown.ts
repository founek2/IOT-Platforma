import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function () {
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    if (instance) {
        console.info("shuting down database")
        await instance.stop();
    }
    process.exit();
}
