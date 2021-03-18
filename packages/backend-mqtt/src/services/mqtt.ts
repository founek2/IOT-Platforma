import mqtt, { MqttClient } from "mqtt";
// import { getConfig } from './config'
import { map, flip, keys, all, equals, contains, toPairs, uniq } from "ramda";
import { processSensorsData, processControlData } from "./FireBase";
import { DiscoveryModel } from "common/lib/models/deviceDiscoveryModel";
import { Server as serverIO } from "socket.io";
import EventEmitter from "events";
import { DeviceModel } from "common/lib/models/deviceModel";
import { HistoricalModel } from "common/lib/models/historyModel";
import eventEmitter from "./eventEmitter";
import { IDevice, DeviceStatus } from "common/lib/models/interface/device";
import { SocketThingState } from "common/lib/types";
import { ComponentType, IThing } from "common/lib/models/interface/thing";
import handlePrefix from "./mqtt/prefix";
import { Config } from "../types";

const emitter = new EventEmitter();

let mqttClient: mqtt.MqttClient | undefined;

type qosType = { qos: 0 | 2 | 1 | undefined };
export function publishStr(topic: string, message: string, opt: qosType = { qos: 2 }) {
	if (!mqttClient) throw new Error("client was not inicialized");

	return mqttClient.publish(topic, message, { qos: opt.qos });
}

export function publish(topic: string, message: string, opt: qosType = { qos: 2 }) {
	if (!mqttClient) throw new Error("client was not inicialized");

	return mqttClient.publish(topic, message, { qos: opt.qos });
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
export default (io: serverIO, config: Config): MqttClient => {
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

		handlePrefix(handle, io);

		handle("v2/+/+/$state", async function (topic, data, [realm, deviceId]) {
			const message: DeviceStatus = data.toString();
			console.log("got", message, realm, deviceId);
			const device = await DeviceModel.findOneAndUpdate(
				{
					"metadata.deviceId": deviceId,
					"metadata.realm": realm,
				},
				{
					"state.status.value": message,
					"state.status.timestamp": new Date(),
				},
				{ new: true }
			)
				.lean()
				.exec();

			if (device)
				uniq(Object.values(device.permissions).flat().map(String)).forEach((userId) =>
					io.to(userId).emit("device", {
						_id: device._id,
						state: {
							status: device.state!.status,
						},
					})
				);
		});

		handle("v2/+/+/+/+", async function (topic, message, [realm, deviceId, nodeId, propertyId]) {
			const timestamp = new Date();
			const device = await DeviceModel.findOneAndUpdate(
				{
					"metadata.deviceId": deviceId,
					"metadata.realm": realm,
					"things.config.nodeId": nodeId,
				},
				{
					$set: {
						"things.$.state.timestamp": timestamp,
						[`things.$.state.value.${propertyId}`]: message.toString(),
					},
				},
				{
					new: true,
				}
			)
				.lean()
				.exec();
			console.log("saving not sensor data");
			if (!device) return;

			sendToUsers(io, device, nodeId, propertyId);

			HistoricalModel.saveControlData(
				device?._id,
				getThing(device, nodeId)._id,
				propertyId,
				Number(message.toString()),
				timestamp
			);
		});
	});

	client.on("error", function (err) {
		console.log("mqtt connection error");
		// client.reconnect()
	});

	return client;
};

function sendToUsers(io: serverIO, device: IDevice, nodeId: string, propertyId: string) {
	let thing = getThing(device, nodeId);

	const updateData: SocketThingState = {
		_id: device._id,
		thing: {
			_id: thing._id,
			state: thing.state,
		},
	};
	device.permissions[thing.config.componentType === "sensor" ? "read" : "control"].forEach((userId) => {
		io.to(userId.toString()).emit("control", updateData);
	});
}

function getThing(device: IDevice, nodeId: IThing["config"]["nodeId"]) {
	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
