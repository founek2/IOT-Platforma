import { logger } from "common/src/logger";
import { IDevice } from "common/src/models/interface/device";
import { INotify, INotifyThingProperty } from "common/src/models/interface/notifyInterface";
import { IThing, IThingProperty } from "common/src/models/interface/thing";
import { PushSubscription, IUser } from "common/src/models/interface/userInterface"
import { NotifyModel } from "common/src/models/notifyModel";
import { UserModel } from "common/src/models/userModel";
import { getProperty } from "common/src/utils/getProperty";
import { getThing } from "common/src/utils/getThing";
import { uniq } from "ramda";
import webpush from "web-push"
import functions from "./notification/functions";
import { NotifyService } from "./notifyService";

type VibratePattern = number | number[];
type NotificationDirection = "auto" | "ltr" | "rtl";

export interface NotificationAction {
    action: string;
    icon?: string;
    title: string;
}

export interface Notification {
    title: string
    actions?: NotificationAction[];
    badge?: string;
    body?: string;
    data?: any;
    dir?: NotificationDirection;
    icon?: string;
    image?: string;
    lang?: string;
    renotify?: boolean;
    requireInteraction?: boolean;
    silent?: boolean;
    tag?: string;
    timestamp?: number;
    vibrate?: VibratePattern;
}

export class NotificationService {
    homepageUrl: string;

    constructor({ publicVapidKey, privateVapidKey, homepageUrl }: { publicVapidKey: string, privateVapidKey: string, homepageUrl: string }) {
        webpush.setVapidDetails("mailto: martin.skalicky@iotdomu.cz", publicVapidKey, privateVapidKey)
        this.homepageUrl = homepageUrl;
    }

    sendNotification(payload: Notification, subscription: PushSubscription) {
        return webpush.sendNotification(subscription, JSON.stringify(payload));
    }


    /**
     * Process all notification set by all users on provided property with current value
    */
    async processData(
        device: IDevice,
        nodeId: IThing['config']['nodeId'],
        propertyId: IThingProperty['propertyId'],
        value: string | number
    ) {
        const deviceThing = getThing(device, nodeId);
        const property = getProperty(deviceThing, propertyId);

        const docs = await NotifyModel.getForProperty(device._id, nodeId, propertyId);

        const output: Output = {};
        const sended: { _id: INotify['_id']; userId: IUser['_id']; prop_id: IThingProperty['_id'] }[] = [];
        const notSended: {
            unSatisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
            satisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
        } = { unSatisfiedItems: [], satisfiedItems: [] };

        docs.forEach(({ _id, userId, things }) => {
            // per USER
            things.forEach((thing) =>
                thing.properties.forEach(
                    processNotifications(_id, userId, value, output, sended, notSended, {
                        title: deviceThing.config.name,
                        name: property.name,
                        unitOfMeasurement: property.unitOfMeasurement,
                    }, this.homepageUrl)
                )
            );
        });

        // Notify.refreshControlItems(deviceId, sended, notSended);
        NotifyService.refreshSendedItems(sended, nodeId);
        NotifyService.refreshNotSendedItems(notSended, nodeId);

        const notificationsToSend = await prepareNotifications(output, sended);
        const results = Promise.all(notificationsToSend.map((data) => this.sendNotification(data.notification, data.subscription)))

        logger.debug("notifications result", JSON.stringify(results))
        // const response = await messaging.sendAll(messages);
        // logger.debug(response.successCount + ' of ' + messages.length + ' messages were sent successfully');

        // const invalidTokens: string[] = [];
        // if (response.successCount !== messages.length) {
        //     response.responses.forEach(({ error }: any, idx: number) => {
        //         if (error) {
        //             if (error.code === 'messaging/registration-token-not-registered') {
        //                 invalidTokens.push(messages[idx].token);
        //             } else logger.debug(error);
        //         }
        //     });
        // }

        // if (invalidTokens.length) {
        //     UserModel.removeNotifyTokens(invalidTokens);
        //     logger.debug('Deleting notify Tokens>', invalidTokens.length);
        // }
    }
}

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
    const units = unitOfMeasurement ? ' ' + unitOfMeasurement : '';
    return {
        title,
        body: `${name} je ${value}${units}`,
        icon: '/favicon.png',
        click_action: homepageUrl,
    };
}

type Output = { [userId: string]: { title: string; body: string; icon: string; click_action: string }[] };


async function getSubscriptionsPerUser(IDs: string[]) {
    const promises: Promise<{ subscriptions: PushSubscription[] }>[] = [];
    const userIds: string[] = [];
    IDs.forEach((userID) => {
        promises.push(UserModel.getSubscriptions(userID));
        userIds.push(userID);
    });

    const arr = await Promise.all(promises);
    return arr.map((obj, i) => ({ subscriptions: obj.subscriptions, userId: userIds[i] }));
}

function isLastSatisfied(tmp: INotifyThingProperty['tmp']) {
    return tmp && tmp.lastSatisfied === true;
}

function processNotifications(
    _id: INotify['_id'],
    userID: IUser['_id'],
    value: number | string,
    output: Output,
    sended: { _id: IThingProperty['_id']; userId: IUser['_id']; prop_id: IThingProperty['_id'] }[],
    notSended: {
        unSatisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
        satisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
    },
    data: CreateNotificationsOptions['data'],
    homepageUrl: string
) {
    return ({ type, value: limit, advanced, _id: prop_id, tmp }: INotifyThingProperty) => {
        /* Check validity */
        const result = functions[type](value, limit, advanced, tmp);
        if (result.ruleSatisfied) {
            if (result.valid) {
                if (!output[userID]) output[userID] = [];

                output[userID].push(createNotification({ data, value, homepageUrl }));
                sended.push({ _id, userId: userID, prop_id });
            } else {
                if (isLastSatisfied(tmp)) notSended.satisfiedItems.push({ _id, prop_id });
            }
        } else {
            if (!isLastSatisfied(tmp)) notSended.unSatisfiedItems.push({ _id, prop_id });
        }
    };
}
async function prepareNotifications(output: Output, sended: { _id: IThingProperty['_id']; userId: IUser['_id'] }[]) {
    const userIds = sended.map((item) => item.userId);
    const uniqIds = uniq(userIds);
    const arrOfTokensPerUser = await getSubscriptionsPerUser(uniqIds);

    return buildNotifications(arrOfTokensPerUser, output);
}

/**
 *
 * @param {Array} arrOfTokens - array of objects {_id: ..., notifyTokens: []}
 * @param {Object} objPerUser - userID as key and array of notifications as value
 */
async function buildNotifications(arrOfTokens: { userId: string; subscriptions: PushSubscription[] }[], objPerUser: Record<IUser["_id"], Notification[]>) {
    const messages: { subscription: PushSubscription, notification: Notification }[] = [];
    arrOfTokens.forEach(({ subscriptions, userId }) => {
        subscriptions.forEach((subscription) => {
            const notifications = objPerUser[userId];
            notifications.forEach((notification) => {
                // TODO neposkládat do jedné notifikace maybe?
                messages.push({
                    notification,
                    subscription,
                });
            });
        });
    });

    return messages
}
