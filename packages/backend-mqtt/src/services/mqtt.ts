import EventEmitter from 'events';
import mqtt, { MqttClient } from 'mqtt';
import { Server as serverIO } from 'socket.io';
import { Config } from '../types';
import handlePrefix from './mqtt/prefix';
import handleV2 from './mqtt/v2';

const emitter = new EventEmitter();

let mqttClient: mqtt.MqttClient | undefined;

type qosType = { qos: 0 | 2 | 1 | undefined };
export function publishStr(topic: string, message: string, opt: qosType = { qos: 2 }) {
    if (!mqttClient) throw new Error('client was not inicialized');

    return mqttClient.publish(topic, message, { qos: opt.qos });
}

export function publish(topic: string, message: string, opt: qosType = { qos: 2 }) {
    if (!mqttClient) throw new Error('client was not inicialized');

    return mqttClient.publish(topic, message, { qos: opt.qos });
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

export default (io: serverIO, config: Config): MqttClient => {
    console.log('connecting to mqtt');

    /* Initialize MQTT client connection */
    const client = mqtt.connect(config.mqtt.url, {
        username: `${config.mqtt.userName}`,
        password: `${config.mqtt.password}`,
        port: config.mqtt.port,
        connectTimeout: 20 * 1000,
        rejectUnauthorized: false,
    });
    console.log(config.mqtt);
    mqttClient = client;

    client.on('connect', function () {
        console.log('mqtt connected');

        // subscriber to all messages
        client.subscribe('#', async function (err, granted) {
            if (err) console.log('problem:', err);
        });
    });

    client.on('message', async function (topic, message) {
        const handle = topicParser(topic, message);
        console.log(topic);

        // handle all messages in unauthenticated world
        if (topic.startsWith('prefix/')) handlePrefix(handle, io);
        // handle all message in authenticated prefix
        else if (topic.startsWith('v2/')) handleV2(handle, io);
    });

    client.on('error', function (err) {
        console.log('mqtt connection error', err);
        // client.reconnect()
    });

    return client;
};
