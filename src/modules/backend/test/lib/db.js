import mongoose from 'mongoose';
import config from '../resources/configBE'
import Jwt from 'framework/src/services/jwt'
import Device from '../../src/models/Device'
import User from '../../src/models/user'

export default () => {
  // connect to a database if needed, then pass it to `callback`:

  //   .connect(`mongodb://${config.dbUser}:${config.dbPwd}@localhost:27017/IOTPlatform`, { useNewUrlParser: true })
  Jwt.init(config)

  return mongoose
    .connect(`mongodb://${config.dbUser}:${config.dbPwd}@localhost:27017/${config.dbName}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(async () => {
      console.log('connected to mongoDB');

      await User.deleteMany({}).exec();
      await Device.deleteMany({}).exec();

      // await User.create({ info: { firstName: "def", lastName: "root", userName: "root" }, auth: { password: "1234567" } })    // root user
      await User.create({ info: { firstName: "testik", lastName: "user", userName: config.testUser }, auth: { password: config.testPassword } }) // basic user
      await User.create({ info: { firstName: "administrator", lastName: "admin", userName: config.mqttUser }, auth: { password: config.mqttPassword }, groups: ["admin"] })   // admin

      return mongoose.connection;
    })
};
