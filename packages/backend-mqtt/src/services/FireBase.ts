import { IDevice } from '@common/models/interface/device';
import { INotifyThingProperty, INotify } from '@common/models/interface/notifyInterface';
import { IThing, IThingProperty } from '@common/models/interface/thing';
import { IUser } from '@common/models/interface/userInterface';
import { NotifyModel } from '@common/models/notifyModel';
import { UserModel } from '@common/models/userModel';
import * as admin from 'firebase-admin';
import { Config } from '../types';
import { getProperty } from '@common/utils/getProperty';
import { getThing } from '@common/utils/getThing';
import functions from './fireBase/notifications/functions';
import { logger } from 'framework-ui/lib/logger';
import { map, prop, uniq, o } from 'ramda';
import { NotifyService } from './notifyService';

/**
 * Funcional implementation sending notifications
 */

let messaging: admin.messaging.Messaging | undefined;
let homepageUrl: string;

/* Initialize firebase SDK for later usage */
export function init(config: Config) {
    if (!config.firebaseAdminPath) return;

    var serviceAccount = require(config.firebaseAdminPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    messaging = admin.messaging();
    homepageUrl = config.homepage;
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

/**
 * Process all notification set by all users on provided property with current value
 * @param {IDevice} device
 * @param {IThing['config']['nodeId']} nodeId
 * @param {IThingProperty['propertyId']} propertyId
 * @param {string | number} value
 */
export async function processData(
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
                })
            )
        );
    });

    // Notify.refreshControlItems(deviceId, sended, notSended);
    NotifyService.refreshSendedItems(sended, nodeId);
    NotifyService.refreshNotSendedItems(notSended, nodeId);

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
    data: CreateNotificationsOptions['data']
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
async function processOutput(output: Output, sended: { _id: IThingProperty['_id']; userId: IUser['_id'] }[]) {
    if (sended.length > 0) {
        const userIds = sended.map((item) => item.userId);
        const uniqIds = uniq(userIds);
        const arrOfTokensPerUser = await getTokensPerUser(uniqIds);

        const invalidTokens = await sendAllNotifications(arrOfTokensPerUser, output);

        if (invalidTokens.length) {
            UserModel.removeNotifyTokens(invalidTokens);
            logger.debug('Deleting notify Tokens>', invalidTokens.length);
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

    if (!messaging) {
        logger.error('Unable to send messages -> FireBase not initialized');
        return [];
    }
    const response = await messaging.sendAll(messages);
    logger.debug(response.successCount + ' of ' + messages.length + ' messages were sent successfully');

    const invalidTokens: string[] = [];
    if (response.successCount !== messages.length) {
        response.responses.forEach(({ error }, idx) => {
            if (error) {
                if (error.code === 'messaging/registration-token-not-registered') {
                    invalidTokens.push(messages[idx].token);
                } else logger.debug(error);
            }
        });
    }

    return invalidTokens;
}
