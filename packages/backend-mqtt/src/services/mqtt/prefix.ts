import { UserModel } from "common/lib/models/userModel";
import { DiscoveryModel } from "common/lib/models/deviceDiscoveryModel";
import { DeviceModel } from "common/lib/models/deviceModel";
import { DeviceStatus } from "common/lib/models/interface/device";
import { ComponentType, PropertyClass, PropertyDataType } from "common/lib/models/interface/thing";
import { Server as serverIO } from "socket.io";
import eventEmitter from "../eventEmitter";

type cbFn = (topic: string, message: any, groups: string[]) => void;
export default function (handle: (stringTemplate: string, fn: cbFn) => void, io: serverIO) {
	handle("prefix/+/$name", async function (topic, data, [deviceId]) {
		DiscoveryModel.updateOne({ deviceId }, { name: data.toString() }, { upsert: true }).exec();
	});

	handle("prefix/+/$realm", async function (topic, data, [deviceId]) {
		DiscoveryModel.updateOne({ deviceId }, { realm: data.toString() }, { upsert: true }).exec();
	});

	handle("prefix/+/$nodes", async function (topic, data, [deviceId]) {
		const nodeIds: string[] = data.toString().split(",");
	});

	handle("prefix/+/+/$name", async function (topic, data, [deviceId, nodeId]) {
		DiscoveryModel.updateOne({ deviceId }, { [`things.${nodeId}.config.name`]: data.toString() }).exec();
	});

	handle("prefix/+/+/$type", async function (topic, data, [deviceId, nodeId, propertyId]) {
		const componentType = data.toString();
		if (!(componentType in ComponentType)) return;

		DiscoveryModel.updateOne({ deviceId }, { [`things.${nodeId}.config.componentType`]: componentType }).exec();
	});

	handle("prefix/+/+/+/$class", async function (topic, data, [deviceId, nodeId, propertyId]) {
		const propertyClass = data.toString();
		if (!(propertyClass in PropertyClass)) return;

		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.propertyClass`]: propertyClass }
		).exec();
	});

	handle("prefix/+/+/+/$unit", async function (topic, data, [deviceId, nodeId, propertyId]) {
		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.unitOfMeasurement`]: data.toString() }
		).exec();
	});

	handle("prefix/+/+/+/$name", async function (topic, data, [deviceId, nodeId, propertyId]) {
		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.name`]: data.toString() }
		).exec();
	});

	handle("prefix/+/+/+/$datatype", async function (topic, data, [deviceId, nodeId, propertyId]) {
		const dataType = data.toString();
		if (!(dataType in PropertyDataType)) return;

		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.dataType`]: dataType }
		).exec();
	});

	handle("prefix/+/+/+/$format", async function (topic, data, [deviceId, nodeId, propertyId]) {
		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.format`]: data.toString() }
		).exec();
	});

	handle("prefix/+/+/+/$settable", async function (topic, data, [deviceId, nodeId, propertyId]) {
		const settable = data.toString();
		if (!(settable === "true" || settable === "false")) return;

		DiscoveryModel.updateOne(
			{ deviceId },
			{ [`things.${nodeId}.config.properties.${propertyId}.settable`]: settable }
		).exec();
	});

	handle("prefix/+/$state", async function (topic, data, [deviceId]) {
		const status: DeviceStatus = data.toString();
		if (!(status in DeviceStatus)) {
			console.log("invalid state");
			return;
		}

		if (status === DeviceStatus.paired) {
			return DiscoveryModel.deleteOne({ deviceId, pairing: true }).exec();
		}

		if (status === DeviceStatus.ready) {
			const doc = await DiscoveryModel.findOne({ deviceId, pairing: true }).exec();
			if (doc) {
				const device = await DeviceModel.findOne({
					"metadata.deviceId": deviceId,
					"metadata.topicPrefix": doc?.realm,
				});
				if (device) return eventEmitter.emit("device_pairing_init", { deviceId, apiKey: device.apiKey });
			}
		}

		const doc = await DiscoveryModel.findOneAndUpdate(
			{ deviceId },
			{ "state.status.value": status, "state.status.timestamp": new Date() },
			{ upsert: status !== DeviceStatus.disconnected, setDefaultsOnInsert: true, new: true }
		)
			.lean()
			.exec();

		const user = await UserModel.findOne({ realm: doc?.realm }).select("_id").lean();
		if (user?._id) io.to(user._id.toString()).emit("deviceDiscovered", doc);
	});
}
