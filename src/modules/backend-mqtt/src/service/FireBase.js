import * as admin from "firebase-admin";
import Notify from 'backend/src/models/Notification'
import User from 'backend/src/models/user'
import Device from 'backend/src/models/Device'
import mongoose from 'mongoose'
import functions from '../lib/notifications/functions'


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

    const output = {}
    const itemIDsSended = []
    const itemIDsNotSended = []
    docs.forEach(({ user: userID, sensors }) => {   // per USER
        sensors.items.forEach(({ JSONkey, type, value: limit, interval, _id, tmp }) => {      // per notification rule
            const value = data[JSONkey]

            /* Check validity */
            if (functions[type](value, limit, interval, tmp)) {
                if (!output[userID]) output[userID] = []

                const { name, unit } = recipe.find(({ JSONkey: key }) => key === JSONkey)

                output[userID].push({
                    // title: JSONkey, body: String(value) + " bla",
                    title,
                    body: `${name} je ${value} ${unit}`,
                    icon: '/favicon.png',
                    click_action: homepageUrl,
                    // image: obj.imgPath
                })
                itemIDsSended.push(_id)
            } else itemIDsNotSended.push(_id)

        })
    })

    if (itemIDsSended.length > 0) {
        const userIDs = Object.keys(output)

        Notify.refreshItems(deviceId, itemIDsSended, itemIDsNotSended, userIDs)

        const arrOfTokens = await getTokensPerUser(userIDs)

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

