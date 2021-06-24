import mqtt, { MqttClient } from 'mqtt';
import { Server as serverIO } from 'socket.io';
import handlePrefix from './mqtt/prefix';
import handleV2 from './mqtt/v2';
import { infoLog, devLog, errorLog } from 'framework-ui/lib/logger';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

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

function invert30seconds(d1: number) {
    return d1 > 30 * 1000 ? 0 : 30 * 1000 - d1;
}

interface MqttConf {
    url: string;
    port: number;
}
type GetUser = () => Promise<Maybe<{ userName: string; password: string }>>;

let lastAttemptAt: Date | null = null;
function connect(config: MqttConf, getUser: GetUser): ReturnType<typeof reconnect> {
    infoLog('Trying to connect to mqtt...');
    const timeOut = lastAttemptAt ? invert30seconds(Date.now() - lastAttemptAt.getTime()) : 0;
    return new Promise((res) => setTimeout(() => res(reconnect(config, getUser)), timeOut));
}

async function reconnect(config: MqttConf, getUser: GetUser): Promise<MqttClient> {
    const doConnect = (await MaybeAsync.fromPromise(getUser)).map((user) =>
        mqtt.connect(config.url, {
            username: `${user.userName}`,
            password: `${user.password}`,
            reconnectPeriod: 0,
            port: config.port,
            rejectUnauthorized: false,
        })
    );

    return (
        doConnect.extract() ||
        new Promise<MqttClient>((res) => {
            setTimeout(() => res(reconnect(config, getUser)), 20 * 1000);
        })
    );
}

function applyListeners(io: serverIO, client: MqttClient, config: MqttConf, getUser: GetUser) {
    client.on('connect', function () {
        infoLog('mqtt connected');

        // subscriber to all messages
        (client as MqttClient).subscribe('#', async function (err, granted) {
            if (err) devLog('problem:', err);
        });
    });

    client.on('message', async function (topic, message) {
        const handle = topicParser(topic, message);
        devLog(topic);

        // handle all messages in unauthenticated world
        if (topic.startsWith('prefix/')) handlePrefix(handle, io);
        // handle all message in authenticated prefix
        else if (topic.startsWith('v2/')) handleV2(handle, io);
    });

    client.on('error', async function (err) {
        errorLog('mqtt connection error', err);
        client.end();
        client = await connect(config, getUser);
    });
}

/* Initialize MQTT client connection */
export default async (io: serverIO, config: MqttConf, getUser: GetUser) => {
    infoLog('connecting to mqtt');

    client = await connect(config, getUser);

    applyListeners(io, client, config, getUser);
};
