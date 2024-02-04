import { MongoMemoryServer } from 'mongodb-memory-server';
import { getDatabaseInstace } from './setup';

export default async function () {
    const instance = getDatabaseInstace();
    if (instance) {
        console.info("shuting down database")
        await instance.stop();
    }
    process.exit();
}
