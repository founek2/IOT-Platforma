import mqtt, { MqttClient } from 'mqtt';
import { Server as serverIO } from 'socket.io';
import handlePrefix from './mqtt/prefix';
import handleV2 from './mqtt/v2';
import { logger } from 'framework-ui/lib/logger';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { isNil } from 'ramda';

let client: mqtt.MqttClient | undefined;

type qosType = { qos: 0 | 2 | 1 | undefined };
export function publishStr(topic: string, message: string, opt: qosType = { qos: 2 }): boolean {
    if (!client) return false;

    client.publish(topic, message, { qos: opt.qos });
    return true;
}

export function publish(topic: string, message: string, opt: qosType = { qos: 2 }): boolean {
    if (!client) return false;

    client.publish(topic, message, { qos: opt.qos });
    return true;
}

export type cbFn = (topic: string, message: any, groups: string[]) => void;
function topicParser(topic: string, message: any) {
    return (stringTemplate: string, fn: cbFn) => {
        const regex = new RegExp('^' + stringTemplate.replace('$', '\\$').replace(/\+/g, '([^/\\$]+)') + '$');
        const match = topic.match(regex) as any;
        //console.log("matching topic=" + topic, "by regex=" + regex, "result=" + match);
        if (!match) return;

        const [wholeMatch, ...groups] = match;
        fn(topic, message, groups || []);
    };
}

const SECONDS_30 = 30 * 1000;
function invert30seconds(d1: number) {
    return d1 >= SECONDS_30 ? 0 : SECONDS_30 - d1;
}

interface MqttConf {
    url: string;
    port: number;
}
type GetUser = () => Promise<Maybe<{ userName: string; password: string }>>;
type ClientCb = (client: MqttClient) => void;

let lastAttemptAt: Date | null = null;
function connect(config: MqttConf, getUser: GetUser, cb: ClientCb) {
    const timeOut = lastAttemptAt == null ? 0 : invert30seconds(Date.now() - lastAttemptAt.getTime());
    lastAttemptAt = new Date();
    logger.info('Trying to connect to mqtt... timeout=', timeOut);
    return new Promise<MqttClient>((res) => setTimeout(async () => res(await reconnect(config, getUser, cb)), timeOut));
}

async function reconnect(config: MqttConf, getUser: GetUser, cb: ClientCb): Promise<MqttClient> {
    const connection = await MaybeAsync(async ({ fromPromise }) => {
        const user = await fromPromise(getUser());

        const client = mqtt.connect(config.url, {
            username: `${user.userName}`,
            password: `${user.password}`,
            reconnectPeriod: 0,
            port: config.port,
            rejectUnauthorized: false,
        });
        cb(client);
        return client;
    });

    return connection.extract() || connect(config, getUser, cb);
}

function applyListeners(io: serverIO, cl: MqttClient, config: MqttConf, getUser: GetUser) {
    cl.on('connect', function () {
        logger.info('mqtt connected');

        // subscriber to all messages
        cl.subscribe('#', async function (err, granted) {
            if (err) logger.error('problem:', err);
            else logger.info('mqtt subscribed');
        });
    });

    cl.on('message', async function (topic, message) {
        const handle = topicParser(topic, message);
        logger.debug(topic);

        // handle all messages in unauthenticated world
        if (topic.startsWith('prefix/')) handlePrefix(handle, io);
        // handle all message in authenticated prefix
        else if (topic.startsWith('v2/')) handleV2(handle, io);
    });

    cl.on('error', async function (err) {
        logger.error('mqtt connection error', err);
        cl.end();
        client = await connect(config, getUser, (cl) => applyListeners(io, cl, config, getUser));
    });
}

/* Initialize MQTT client connection */
export default async (io: serverIO, config: MqttConf, getUser: GetUser) => {
    client = await connect(config, getUser, (cl) => applyListeners(io, cl, config, getUser));
};
