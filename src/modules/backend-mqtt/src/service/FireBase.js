import * as admin from "firebase-admin";
import Notify from 'backend/src/models/Notification'
import User from 'backend/src/models/user'
import functions from '../lib/notifications/functions'
import { head, keys } from 'ramda'
import { ControlStateValuesToText } from 'frontend/src/constants'

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

// TODO nelze překládat state do textu bez návaznosti na typu....
// ACTIVATOR pro 1 není Zapnuto, ale aktivován
// Udělat jeden objekt, kterému se předá typ a vrátí instanci objektu s veškerými metodami pro transformace/výstupy
function translateStateToText(value, STATEkey, recipe) {
    const { name } = recipe
    return `${name} je ${ControlStateValuesToText[STATEkey](value)}`
}

function createNotification(options, mode = "sensors") {
    if (mode === "sensors") {
        const { info: { title }, recipe: { name, unit }, value, homepageUrl } = options
        return {
            title,
            body: `${name} je ${value} ${unit}`,
            icon: '/favicon.png',
            click_action: homepageUrl,
        }
    } else if (mode === "control") {
        const { recipe, value, homepageUrl, STATEkey } = options
        const { name, type } = recipe

        return {
            title: name,
            body: translateStateToText(value, STATEkey, recipe),
            icon: '/favicon.png',
            click_action: homepageUrl,
        }

    } else console.log("ERROR: missing notif for mode>", mode)
}

export async function processControlData(doc, data) {
    const { _id: deviceId } = doc
    console.log("data", data)
    const JSONkey = head(keys(data))
    const docs = await Notify.getControlItems(deviceId, Object.keys(data[JSONkey]), JSONkey)

    const output = {}
    const sended = { items: [], users: new Set() }
    const notSended = { unSatisfiedItems: [], satisfiedItems: [], users: new Set() }
    docs.forEach(({ user: userID, control }) => {   // per USER
        control.items.forEach(processNotifications(userID, data, "control", output, sended, notSended, doc))
    })

    Notify.refreshControlItems(deviceId, sended, notSended)

    processOutput(output, sended)
}

/**
 * Process notifications for One device and send them
 * @param {Object} device 
 * @param {Object} data 
 */
export async function processSensorsData(doc, data) {
    const { _id: deviceId } = doc
    const docs = await Notify.getSensorItems(deviceId, Object.keys(data))
    console.log("docs", docs)
    const output = {}
    const sended = { items: [], users: new Set() }
    const notSended = { unSatisfiedItems: [], satisfiedItems: [], users: new Set() }

    docs.forEach(({ user: userID, sensors }) => {   // per USER
        sensors.items.forEach(processNotifications(userID, data, "sensors", output, sended, notSended))
    })

    // console.log(notSended)
    Notify.refreshSensorsItems(deviceId, sended, notSended)

    processOutput(output, sended)
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

function processNotifications(userID, data, mode, output, sended, notSended, doc) {
    const { info, control: { recipe } } = doc
    return ({ JSONkey, type, value: limit, advanced = defaultAdvanced, _id, tmp }) => {      // per notification rule
        let recipeKey;
        let value;
        if (mode === "control") {
            recipeKey = head(keys(data))
            value = data[recipeKey][JSONkey]
        } else {
            recipeKey = JSONkey
            value = data[JSONkey]
        }

        /* Check validity */
        const result = functions[type](value, limit, advanced, tmp)
        if (result.ruleSatisfied) {
            if (result.valid) {
                if (!output[userID]) output[userID] = []

                const rec = recipe.find(({ JSONkey: key }) => key === recipeKey)

                output[userID].push(createNotification({ info, recipe: rec, value, homepageUrl, STATEkey: JSONkey }, mode))
                sended.items.push(_id)
                sended.users.add(userID)
            } else {
                notSended.satisfiedItems.push(_id)
            }
        } else {
            notSended.unSatisfiedItems.push(_id)
            notSended.users.add(userID)
        }
    }
}
async function processOutput(output, sended) {
    if (sended.items.length > 0) {
        const arrOfTokens = await getTokensPerUser(sended.users)

        const invalidTokens = await sendAllNotifications(arrOfTokens, output)

        if (invalidTokens.length) {
            User.removeNotifyTokens(invalidTokens).exec()
            console.log("Deleting notify Tokens>", invalidTokens.length)
        }
    }
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

