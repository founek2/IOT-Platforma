import * as admin from "firebase-admin";
import Notify from 'backend/src/models/Notification'
import User from 'backend/src/models/user'
import Device from 'backend/src/models/Device'
import mongoose from 'mongoose'
import functions from '../lib/notifications/functions'

const defaultAdvanced = {
    interval: -1,
    from: '00:00',
    to: '23:59',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
}

let messaging
let homepageUrl;

export function init(config) {
    var serviceAccount = require(config.firebaseAdminPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://iot-platforma-v2.firebaseio.com"
    });

    messaging = admin.messaging()
    homepageUrl = config.homepage
}

/**
 * Process notifications for One device and send them
 * @param {Object} device 
 * @param {Object} data 
 */
export async function processSensorsData({ _id: deviceId, sensors: { recipe }, info: { title } }, data) {
    const docs = await Notify.getSensorItems(deviceId, Object.keys(data))
    console.log("docs", docs)
    const output = {}
    const sended = { items: [], users: new Set() }
    const notSended = { unSatisfiedItems: [], satisfiedItems: [], users: new Set() }
    docs.forEach(({ user: userID, sensors }) => {   // per USER
        sensors.items.forEach(({ JSONkey, type, value: limit, advanced = defaultAdvanced, _id, tmp }) => {      // per notification rule
            const value = data[JSONkey]

            /* Check validity */
            const result = functions[type](value, limit, advanced, tmp)
            if (result.ruleSatisfied) {
                if (result.valid) {
                    if (!output[userID]) output[userID] = []

                    const { name, unit } = recipe.find(({ JSONkey: key }) => key === JSONkey)

                    output[userID].push({
                        title,
                        body: `${name} je ${value} ${unit}`,
                        icon: '/favicon.png',
                        click_action: homepageUrl,
                    })
                    sended.items.push(_id)
                    sended.users.add(userID)
                } else {
                    notSended.satisfiedItems.push(_id)
                }
            } else {
                notSended.unSatisfiedItems.push(_id)
                notSended.users.add(userID)
            }
        })
    })

    // console.log(notSended)
    Notify.refreshItems(deviceId, sended, notSended)

    if (sended.items.length > 0) {
        const arrOfTokens = await getTokensPerUser(sended.users)

        const invalidTokens = await sendAllNotifications(arrOfTokens, output)

        if (invalidTokens.length) {
            User.removeNotifyTokens(invalidTokens).exec()
            console.log("Deleting notify Tokens>", invalidTokens.length)
        }
    }
}

function getTokensPerUser(IDs) {
    const promises = []
    IDs.forEach(userID => {
        promises.push(
            User.getNotifyTokens(userID)
        )
    })

    return Promise.all(promises)
}

/**
 * 
 * @param {Array} arrOfTokens - array of objects {_id: ..., notifyTokens: []}
 * @param {Object} objPerUser - userID as key and array of notifications as value
 */
async function sendAllNotifications(arrOfTokens, objPerUser) {
    const messages = [];

    arrOfTokens.forEach(({ notifyTokens, _id }) => {
        notifyTokens.forEach(token => {
            const notifications = objPerUser[_id]
            notifications.forEach(body => {      // TODO neposkládat do jedné notifikace maybe?
                messages.push({
                    webpush: {
                        notification: body,
                    },
                    token
                })
            })

        })
    })

    const response = await messaging.sendAll(messages)
    console.log(response.successCount + " of " + messages.length + ' messages were sent successfully')


    const invalidTokens = []
    if (response.successCount !== messages.length) {
        response.responses.forEach(({ error }, idx) => {
            if (error) {
                const { errorInfo: { code } } = error
                if (code === "messaging/registration-token-not-registered") {
                    // console.log(Object.keys(error))
                    invalidTokens.push(messages[idx].token)
                }
            }

        })
    }

    return invalidTokens
}

