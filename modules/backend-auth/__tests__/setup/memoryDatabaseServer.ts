import { MongoMemoryServer } from 'mongodb-memory-server';

class MemoryDatabaseServer {
    mongod?: MongoMemoryServer;

    async start() {
        this.mongod = await MongoMemoryServer.create({
            binary: {
                version: '4.4.4',
            },
        });
    }

    stop() {
        return this.mongod?.stop();
    }

    getConnectionString() {
        if (!this.mongod) throw new Error('Memory database not running');
        return this.mongod.getUri();
    }
}

export default new MemoryDatabaseServer();
