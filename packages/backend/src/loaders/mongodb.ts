import logger from 'framework-ui/lib/logger';
import { Config } from '../types';
import mongoose from 'mongoose';
import createMongoUri from 'common/lib/utils/createMongoUri';

/* Initialize connection to mongoDB */
export default async (config: Config['db']): Promise<mongoose.Connection | null> => {
    try {
        const mong = await mongoose.connect(createMongoUri(config), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        logger.info('Connection to DB has been established successfully.');

        /** Uncomment this for sync DB with models and seed data */
        // await sequelize.sync({ force: true }) && await loadSeeds(sequelize)

        // console.log("All models were synchronized successfully.");
        return mong.connection;
    } catch (error) {
        logger.error('Unable to connect to the database: %s', error);
    }

    return null;
};
