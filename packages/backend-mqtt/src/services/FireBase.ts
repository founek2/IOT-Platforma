import { IDevice } from "common/lib/models/interface/device";
import { INotifyThingProperty } from "common/lib/models/interface/notifyInterface";
import { IThing, IThingProperty } from "common/lib/models/interface/thing";
import { IUser } from "common/lib/models/interface/userInterface";
import { NotifyModel } from "common/lib/models/notifyModel";
import { UserModel } from "common/lib/models/userModel";
import * as admin from "firebase-admin";
import { Config } from "../types";
import { getProperty } from "common/lib/utils/getProperty";
import { getThing } from "common/lib/utils/getThing";
import functions from "./fireBase/notifications/functions";

const defaultAdvanced = {
	interval: -1,
	from: "00:00",
	to: "23:59",
	daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
};

let messaging: admin.messaging.Messaging;
let homepageUrl: string;

export function init(config: Config) {
	var serviceAccount = require(config.firebaseAdminPath);

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});

	messaging = admin.messaging();
	homepageUrl = config.homepage;
}

// TODO nelze překládat state do textu bez návaznosti na typu....
// ACTIVATOR pro 1 není Zapnuto, ale aktivován
// Udělat jeden objekt, kterému se předá typ a vrátí instanci objektu s veškerými metodami pro transformace/výstupy
// function translateStateToText(value, STATEkey, recipe) {
// 	const { name } = recipe;
// 	return `${name} je ${ControlStateValuesToText[STATEkey](value)}`;
// }

interface CreateNotificationsOptions {
	value: number | string;
	homepageUrl: string;
	data: { title: string; name: string; unitOfMeasurement?: string };
}
function createNotification(options: CreateNotificationsOptions) {
	const {
		data: { name, unitOfMeasurement, title },
		value,
		homepageUrl,
	} = options;
	return {
		title,
		body: `${name} je ${value} ${unitOfMeasurement}`,
		icon: "/favicon.png",
		click_action: homepageUrl,
	};
}

export async function processData(
	device: IDevice,
	nodeId: IThing["config"]["nodeId"],
	propertyId: IThingProperty["propertyId"],
	value: string | number
) {
	const deviceThing = getThing(device, nodeId);
	const property = getProperty(deviceThing, propertyId);

	const docs = await NotifyModel.getForProperty(device._id, nodeId, propertyId);

	const output = {};
	const sended = { items: [], users: new Set() };
	const notSended = { unSatisfiedItems: [], satisfiedItems: [], users: new Set() };
	docs.forEach(({ userId, things }) => {
		// per USER
		things.forEach((thing) =>
			thing.properties.forEach(
				processNotifications(userId, value, output, sended, notSended, {
					title: deviceThing.config.name,
					name: property.name,
					unitOfMeasurement: property.unitOfMeasurement,
				})
			)
		);
	});

	// Notify.refreshControlItems(deviceId, sended, notSended);

	processOutput(output, sended);
}

async function getTokensPerUser(IDs: string[]) {
	const promises: Array<Promise<{ notifyTokens: string[] }>> = [];
	const userIds: string[] = [];
	IDs.forEach((userID) => {
		promises.push(UserModel.getNotifyTokens(userID));
		userIds.push(userID);
	});

	const arr = await Promise.all(promises);
	return arr.map((obj, i) => ({ notifyTokens: obj.notifyTokens, userId: userIds[i] }));
}

function processNotifications(
	userID: IUser["_id"],
	value: number | string,
	output: any,
	sended: any,
	notSended: any,
	data: CreateNotificationsOptions["data"]
) {
	return ({ type, value: limit, advanced = defaultAdvanced, _id, tmp }: INotifyThingProperty) => {
		/* Check validity */
		const result = functions[type](value, limit, advanced, tmp);
		if (result.ruleSatisfied) {
			if (result.valid) {
				if (!output[userID]) output[userID] = [];

				output[userID].push(createNotification({ data, value, homepageUrl }));
				sended.items.push(_id);
				sended.users.add(userID);
			} else {
				notSended.satisfiedItems.push(_id);
			}
		} else {
			notSended.unSatisfiedItems.push(_id);
			notSended.users.add(userID);
		}
	};
}
async function processOutput(output: any, sended: any) {
	if (sended.items.length > 0) {
		const arrOfTokensPerUser = await getTokensPerUser(sended.users);

		const invalidTokens = await sendAllNotifications(arrOfTokensPerUser, output);

		if (invalidTokens.length) {
			UserModel.removeNotifyTokens(invalidTokens);
			console.log("Deleting notify Tokens>", invalidTokens.length);
		}
	}
}

/**
 *
 * @param {Array} arrOfTokens - array of objects {_id: ..., notifyTokens: []}
 * @param {Object} objPerUser - userID as key and array of notifications as value
 */
async function sendAllNotifications(arrOfTokens: { userId: string; notifyTokens: string[] }[], objPerUser: any) {
	const messages: admin.messaging.TokenMessage[] = [];
	arrOfTokens.forEach(({ notifyTokens, userId }) => {
		notifyTokens.forEach((token) => {
			const notifications = objPerUser[userId];
			notifications.forEach((body: any) => {
				// TODO neposkládat do jedné notifikace maybe?
				messages.push({
					webpush: {
						notification: body,
					},
					token,
				});
			});
		});
	});

	const response = await messaging.sendAll(messages);
	console.log(response.successCount + " of " + messages.length + " messages were sent successfully");

	const invalidTokens: string[] = [];
	if (response.successCount !== messages.length) {
		response.responses.forEach(({ error }, idx) => {
			if (error) {
				if (error.code === "messaging/registration-token-not-registered") {
					// console.log(Object.keys(error))
					invalidTokens.push(messages[idx].token);
				}
			}
		});
	}

	return invalidTokens;
}
