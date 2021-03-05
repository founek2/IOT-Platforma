import mqtt, { MqttClient } from "mqtt";
// import { getConfig } from './config'
import config from "../config";
import { map, flip, keys, all, equals, contains, toPairs } from "ramda";
import { processSensorsData, processControlData } from "./FireBase";
import { DeviceDiscovery } from "common/lib/models/deviceDiscovery";
import { Server as serverIO } from "socket.io";
import EventEmitter from "events";
import { DeviceModel } from "common/src/models/device";
import eventEmitter from "./eventEmitter";
const emitter = new EventEmitter();

let mqttClient: mqtt.MqttClient | undefined;

type qosType = { qos: 0 | 2 | 1 | undefined };
export function publish(topic: string, message: Object, opt: qosType = { qos: 2 }) {
	if (!mqttClient) throw new Error("client was not inicialized");

	return mqttClient.publish(topic, JSON.stringify(message), { qos: opt.qos });
}

type cbFn = (topic: string, message: any, groups: string[]) => void;
function topicParser(topic: string, message: any) {
	return (stringTemplate: string, fn: cbFn) => {
		const regex = new RegExp(stringTemplate.replace("$", "\\$").replace(/\+/g, "([^/\\$]+)"));
		const match = topic.match(regex) as any;
		//console.log("matching topic=" + topic, "by regex=" + regex, "result=" + match);
		if (!match) return;

		const [wholeMatch, ...groups] = match;
		fn(topic, message, groups || []);
	};
}

export function subscribeDeviceState(deviceId: string, cb: (status: string) => void) {
	emitter.on("device_" + deviceId, cb);
}

const magicRegex = /^(?:\/([\w]*)([/]\w+[/]\w+[/]\w+)(.*))/;
export default (io: serverIO): MqttClient => {
	console.log("connecting to mqtt");
	const client = mqtt.connect(config.mqtt.url, {
		username: `${config.mqtt.userName}`,
		password: `${config.mqtt.password}`,
		port: config.mqtt.port,
		connectTimeout: 20 * 1000,
		rejectUnauthorized: false,
	});
	mqttClient = client;

	client.on("connect", function () {
		client.subscribe("#", async function (err, granted) {
			if (err) console.log("problem:", err);
		});
	});

	client.on("message", async function (topic, message) {
		const handle = topicParser(topic, message);
		console.log(topic);

		handle("prefix/+/+/$config", async function (topic, data, [deviceId, componentType]) {
			const message = JSON.parse(data.toString());
			console.log("component=" + componentType, "deviceId=" + deviceId, "message=" + JSON.stringify(message));

			if (componentType === "device") {
				console.log("creating");
				await DeviceDiscovery.updateOne(
					{ deviceId },
					{ userName: message.userName, name: message.name || deviceId },
					{ upsert: true, setDefaultsOnInsert: true }
				);
			} else {
				if (await DeviceDiscovery.exists({ deviceId })) {
					const query =
						componentType === "sensor"
							? { deviceId, "things.config.componentId": message.componentId }
							: { deviceId, "things.config.nodeId": message.nodeId };
					const res = await DeviceDiscovery.updateOne(query, {
						$set: { "things.$.config": { ...message, componentType } },
					});
					if (res.nModified === 1) return;
				}
				await DeviceDiscovery.updateOne(
					{ deviceId },
					{ $push: { things: { config: { ...message, componentType } } } },
					{ upsert: true, setDefaultsOnInsert: true }
				);
			}
		});

		handle("prefix/+/$state", async function (topic, message, [deviceId]) {
			if (message.toString() === "paired") {
				return DeviceDiscovery.deleteOne({ deviceId, pairing: true }).exec();
			}

			if (message.toString() === "ready") {
				const doc = await DeviceDiscovery.findOne({ deviceId, pairing: true }).exec();
				if (doc) {
					const device = await DeviceModel.findOne({
						"info.deviceId": deviceId,
						"metadata.topicPrefix": doc?.userName,
					});
					if (device) return eventEmitter.emit("device_pairing_init", { deviceId, apiKey: device.apiKey });
				}
			}

			DeviceDiscovery.updateOne(
				{ deviceId },
				{ "state.status.value": message.toString(), "state.status.timestamp": new Date() },
				{ upsert: true, setDefaultsOnInsert: true }
			).exec();
		});

		handle("v2/+/+/$state", async function (topic, message, [topicPrefix, deviceId]) {
			console.log("got", message.toString(), topicPrefix, deviceId);
			DeviceModel.updateOne(
				{
					"info.deviceId": deviceId,
					"metadata.topicPrefix": topicPrefix,
				},
				{
					"state.status.value": message.toString(),
					"state.status.timestamp": new Date(),
				}
			).exec();
		});

		handle("v2/+/+/sensor/+", async function (topic, message, [topicPrefix, deviceId, propertyId]) {
			DeviceModel.updateOne(
				{
					"info.deviceId": deviceId,
					"metadata.topicPrefix": topicPrefix,
					"things.config.propertyId": propertyId,
				},
				{
					$set: { "things.$.state": { timestamp: new Date(), value: message.toString() } },
				}
			).exec();
			console.log("saving sensor data");
		});

		handle(
			"v2/+/+/((?:(?!sensor).)*)/+",
			async function (topic, message, [topicPrefix, deviceId, nodeId, propertyId]) {
				DeviceModel.updateOne(
					{
						"info.deviceId": deviceId,
						"metadata.topicPrefix": topicPrefix,
						"things.config.nodeId": nodeId,
					},
					{
						$set: {
							"things.$.state.timestamp": new Date(),
							[`things.$.state.value.${propertyId}`]: message.toString(),
						},
					}
				).exec();
				console.log("saving not sensor data");
			}
		);
	});

	client.on("error", function (err) {
		console.log("mqtt connection error");
		// client.reconnect()
	});

	return client;
};
