import { logger } from "common/lib/logger";
import { IDevice } from "common/lib/models/interface/device";
import { INotify, INotifyThingProperty } from "common/lib/models/interface/notifyInterface";
import { IThing, IThingProperty } from "common/lib/models/interface/thing";
import { PushSubscription, IUser } from "common/lib/models/interface/userInterface"
import { NotifyModel } from "common/lib/models/notifyModel";
import { UserModel } from "common/lib/models/userModel";
import { getProperty } from "common/lib/utils/getProperty";
import { getThing } from "common/lib/utils/getThing";
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
        if (docs.length === 0) return;

        const output: Output = {};
        const sended: { _id: INotify['_id']; userId: IUser['_id']; prop_id: IThingProperty['_id'] }[] = [];
        const notSended: {
            unSatisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
            satisfiedItems: { _id: INotify['_id']; prop_id: IThingProperty['_id'] }[];
        } = { unSatisfiedItems: [], satisfiedItems: [] };

        docs.forEach(({ _id, userId, things }) => {
            logger.silly("_id", _id, "user", userId)
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

        const invalidTokens: PreparedNotification[] = [];
        const validTokens: PreparedNotification[] = [];

        const notificationsToSend = await prepareNotifications(output, sended);
        const results = await Promise.all(notificationsToSend.map((data) => this.sendNotification(data.notification, data.subscription).then((result) => ({ result })).catch((err: webpush.WebPushError) => ({ result: err }))))
        results.forEach(({ result }, idx) => {
            if (result.statusCode == 410) {
                invalidTokens.push(notificationsToSend[idx]);
            } else if (200 <= result.statusCode && result.statusCode < 299) {
                validTokens.push(notificationsToSend[idx]);
            }
        })

        logger.debug(validTokens.length + ' of ' + results.length + ' messages were sent successfully');


        const deleteResults = await Promise.all(invalidTokens.map(({ userId, subscription }) => {
            UserModel.removeSubscription(userId, subscription);
        }))
        if (deleteResults.length) logger.debug('Deleted push subscriptions>', deleteResults.length)

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
    // const promises: Promise<{ pushSubscriptions: PushSubscription[] }>[] = [];
    const userIds: string[] = [];
    const promises = IDs.map((userID) => UserModel.getSubscriptions(userID));

    return Promise.all(promises);
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
        logger.debug("result of processing")
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

type PreparedNotification = { subscription: PushSubscription, notification: Notification, userId: string };
/**
 *
 * @param {Array} arrOfTokens - array of objects {_id: ..., notifyTokens: []}
 * @param {Object} objPerUser - userID as key and array of notifications as value
 */
async function buildNotifications(arrOfTokens: (Pick<IUser, "_id" | "pushSubscriptions">)[], objPerUser: Record<IUser["_id"], Notification[]>) {
    const messages: PreparedNotification[] = [];
    arrOfTokens.forEach(({ pushSubscriptions, _id: userId }) => {
        pushSubscriptions.forEach((subscription) => {
            const notifications = objPerUser[userId];
            notifications.forEach((notification) => {
                // TODO neposkládat do jedné notifikace maybe?
                messages.push({
                    notification,
                    subscription,
                    userId: userId,
                });
            });
        });
    });

    return messages
}
