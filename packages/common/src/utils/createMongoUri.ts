type arg = {
    url: string;
    userName: string;
    password: string;
    dbName: string;
    port: number;
};

/**
 * Creates mongodb connection uri
 */
export default function (conf: arg) {
    return `mongodb://${conf.userName}:${conf.password}@${conf.url}:${conf.port}/${conf.dbName}`;
}
