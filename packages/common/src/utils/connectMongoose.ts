import mongoose from "mongoose"
import createMongoUri from "./createMongoUri";

export function connectMongoose(config: {
    userName: string;
    password: string;
    dbName: string;
    url: string;
    port: number;
}) {
    return mongoose.connect(createMongoUri(config), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
}