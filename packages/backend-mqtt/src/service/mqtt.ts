import mqtt, { MqttClient } from "mqtt";
// import { getConfig } from './config'
import config from "../config";
import { map, flip, keys, all, equals, contains, toPairs, uniq } from "ramda";
import { processSensorsData, processControlData } from "./FireBase";
import { DeviceDiscovery } from "common/lib/models/deviceDiscoveryModel";
import { Server as serverIO } from "socket.io";
import EventEmitter from "events";
import { DeviceModel, IDevice } from "common/lib/models/deviceModel";
import { HistoricalModel } from "common/lib/models/historyModel";
import eventEmitter from "./eventEmitter";
import { Device, DeviceStatus } from "common/lib/models/interface/device";
import { SocketThingState } from "common/lib/types";
import { IThing } from "common/lib/models/interface/thing";
import User from "backend/dist/models/user";

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
					let query;
					if (componentType === "sensor") {
						query = { deviceId, "things.config.propertyId": message.propertyId };
						message.nodeId = "sensor";
					} else query = { deviceId, "things.config.nodeId": message.nodeId };

					const res = await DeviceDiscovery.updateOne(query, {
						$set: { "things.$.config": { ...message, componentType } },
					});
					if (res.nModified === 1) return;
					console.log("not updated");
				}
				await DeviceDiscovery.updateOne(
					{ deviceId },
					{ $push: { things: { config: { ...message, componentType } } } },
					{ upsert: true, setDefaultsOnInsert: true }
				);
			}
		});

		handle("prefix/+/$state", async function (topic, data, [deviceId]) {
			const message: DeviceStatus = data.toString();
			if (message === DeviceStatus.Disconnected) return;

			if (message === DeviceStatus.Paired) {
				return DeviceDiscovery.deleteOne({ deviceId, pairing: true }).exec();
			}

			if (message === DeviceStatus.Ready) {
				const doc = await DeviceDiscovery.findOne({ deviceId, pairing: true }).exec();
				if (doc) {
					const device = await DeviceModel.findOne({
						"metadata.deviceId": deviceId,
						"metadata.topicPrefix": doc?.userName,
					});
					if (device) return eventEmitter.emit("device_pairing_init", { deviceId, apiKey: device.apiKey });
				}
			}

			const doc = await DeviceDiscovery.findOneAndUpdate(
				{ deviceId },
				{ "state.status.value": message, "state.status.timestamp": new Date() },
				{ upsert: true, setDefaultsOnInsert: true, new: true }
			)
				.lean()
				.exec();

			const user = await User.findOne({ "info.userName": doc?.userName }).select("_id").lean();
			if (user?._id) io.to(user._id.toString()).emit("deviceDiscovered", doc);
		});

		handle("v2/+/+/$state", async function (topic, data, [topicPrefix, deviceId]) {
			const message: DeviceStatus = data.toString();
			console.log("got", message, topicPrefix, deviceId);
			const device = await DeviceModel.findOneAndUpdate(
				{
					"metadata.deviceId": deviceId,
					"metadata.topicPrefix": topicPrefix,
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

		handle("v2/+/+/sensor/+", async function (topic, message, [topicPrefix, deviceId, propertyId]) {
			const timestamp = new Date();
			const device = await DeviceModel.findOneAndUpdate(
				{
					"metadata.deviceId": deviceId,
					"metadata.topicPrefix": topicPrefix,
					"things.config.propertyId": propertyId,
				},
				{
					$set: { "things.$.state": { timestamp, value: message.toString() } },
				}
			)
				.lean()
				.exec();
			console.log("saving sensor data");
			if (!device) return;

			sendToUsers(io, "read", device, "sensor", propertyId);
			HistoricalModel.saveSensorData(
				device?._id,
				getThing(device, "sensor", propertyId)._id,
				propertyId,
				Number(message.toString()),
				timestamp
			);
		});

		handle(
			"v2/+/+/((?:(?!sensor).)*)/+",
			async function (topic, message, [topicPrefix, deviceId, nodeId, propertyId]) {
				const timestamp = new Date();
				const device = await DeviceModel.findOneAndUpdate(
					{
						"metadata.deviceId": deviceId,
						"metadata.topicPrefix": topicPrefix,
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

				sendToUsers(io, "control", device, nodeId, propertyId);

				HistoricalModel.saveControlData(
					device?._id,
					getThing(device, nodeId, propertyId)._id,
					propertyId,
					Number(message.toString()),
					timestamp
				);
			}
		);
	});

	client.on("error", function (err) {
		console.log("mqtt connection error");
		// client.reconnect()
	});

	return client;
};

function sendToUsers(io: serverIO, type: "read" | "control", device: Device, nodeId: string, propertyId: string) {
	let thing = getThing(device, nodeId, propertyId, type === "read");

	const updateData: SocketThingState = {
		_id: device._id,
		thing: {
			_id: thing._id,
			state: thing.state,
		},
	};
	device.permissions[type].forEach((userId) => {
		io.to(userId.toString()).emit("control", updateData);
	});
}

function getThing(
	device: Device,
	nodeId: IThing["config"]["nodeId"],
	propertyId: IThing["config"]["propertyId"],
	isSensor: boolean = false
) {
	if (isSensor)
		return device.things.find((thing) => thing.config.nodeId === nodeId && thing.config.propertyId === propertyId)!;
	return device.things.find((thing) => thing.config.nodeId === nodeId)!;
}
