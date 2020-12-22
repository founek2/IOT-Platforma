import mongoose from 'mongoose';
import * as types from "./types"

export default ({ db }, callback) => {
    // connect to a database if needed, then pass it to `callback`:

    //   .connect(`mongodb://${config.dbUser}:${config.dbPwd}@localhost:27017/IOTPlatform`, { useNewUrlParser: true })

    mongoose
        .connect(`mongodb://${db.userName}:${db.password}@${db.url}:${db.port}/${db.name}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('connected to mongoDB');
            callback(mongoose.connection);
        })
        .catch(err => {
            // mongoose connection error will be handled here
            console.error('App starting error:', err.stack);
            //process.exit(1);
        });
};
