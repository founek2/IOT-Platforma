import mongoose from 'mongoose';
import { connectMongoose } from '@common/utils/connectMongoose';
import { credentials } from '../resources/credentials';
import { UserService } from '@common/services/userService';
import { AuthType } from '@common/constants';
import config from '../resources/config';
import { JwtService } from '@common/services/jwtService';

export default async () => {
    // JwtService.init(config.jwt);

    // connect to a database
    // if (!config.dbUri.endsWith('test'))
    //     throw Error('Probably invalid .env passed, db name does not end with test -> ' + config.dbUri);
    // const mongo = await connectMongoose(config.dbUri);
    // const db = mongo.connection.db;
    // const collections = await db.listCollections().toArray();

    // Create an array of collection names and drop each collection
    // await Promise.all(
    //     collections
    //         .map((collection) => collection.name)
    //         .map(async (collectionName) => {
    //             return db.dropCollection(collectionName);
    //         })
    // );

    await UserService.create({
        info: {
            firstName: 'Root',
            lastName: 'Something',
            userName: credentials.root.userName,
            email: credentials.root.email,
        },
        auth: {
            types: [AuthType.passwd],
            password: credentials.root.password,
        },
    }); // admin

    // first created is always admin
    const data = await UserService.create({
        info: {
            firstName: 'administrator',
            lastName: 'admin',
            userName: credentials.admin.userName,
            email: credentials.admin.email,
        },
        auth: {
            types: [AuthType.passwd],
            password: credentials.admin.password,
        },
    }); // admin
    UserService.updateUser(data.doc._id, { groups: ['admin'] });

    await UserService.create({
        info: {
            firstName: 'testik',
            lastName: 'user',
            userName: credentials.user.userName,
            email: credentials.user.email,
        },
        auth: {
            types: [AuthType.passwd],
            password: credentials.user.password,
        },
    }); // basic user
};
