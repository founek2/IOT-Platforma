import mqtt from 'mqtt'
// import { getConfig } from './config'
import config from "backend/config/index.js"
import Device from 'backend/models/Device'
import { map, flip, keys, all, equals, contains, toPairs, _ } from 'ramda';

let mqttClient = null

export function publish(topic, message, opt = { qos: 2 }) {
    if (!mqttClient) throw new Error("client was not inicialized")
    return mqttClient.publish(topic, JSON.stringify(message), opt)
}

const magicRegex = /^(?:\/([\w]*)([\/]\w+[\/]\w+[\/]\w+)(.*))/;
export default (io) => {
    console.log("connecting to mqtt")
    const client = mqtt.connect('mqtts://localhost', { username: `${config.mqttUser}`, password: `${config.mqttPassword}`, port: 8883, connectTimeout: 20 * 1000, rejectUnauthorized: false })
    mqttClient = client

    client.on('connect', function () {
        client.subscribe('#', function (err) {
            if (!err) {
                console.log("subscribed to #")
            } else console.log("mqtt error:", err)
        })
    })

    client.on('message', async function (topic, message) {
        // const idObj = topic.match(/^(?:[^\/]*\/){1}([^\/]*)/)
        // const topicObj = topic.match(/^(?:[^\/]*\/){2}(.*)\//)
        try {
            const [_, ownerId, deviceTopic, restTopic] = topic.match(magicRegex);
            if (!ownerId || !deviceTopic) return;
            if (restTopic === "" || restTopic === "/") {

                const data = JSON.parse(message.toString())
                const updateTime = new Date()
                const { deviceID, publicRead, permissions: { read = [] } } = await Device.updateSensorsData(ownerId, deviceTopic, data, updateTime)
                const emitData = { deviceID, data, updatedAt: updateTime }

                if (publicRead) io.to("public").emit("sensors", emitData)
                else    // send to all users with permissions
                    read.forEach((id) => {
                        io.to(id.toString()).emit("sensors", emitData)
                    })

                console.log("emmiting to public", publicRead)
            } else if (restTopic === "/initControl") {

                const data = JSON.parse(message.toString())
                const dev = await Device.findOne({ createdBy: ownerId, topic: deviceTopic }, "control.recipe")
                const jsonKeys = dev.control.recipe.map(obj => obj.JSONkey)
                const result = map(flip(contains)(jsonKeys), keys(data))

                if (all(equals(true), result)) {
                    const updateTime = new Date()
                    const { permissions: { control = [] }, _id } = await Device.initControl(ownerId, deviceTopic, data, updateTime)
                    console.log("init control", data)

                    let newData = {};
                    toPairs(data).forEach(([key, val]) => {
                        newData[key] = { state: val, updatedAt: updateTime }
                    })
                    const emitData = { deviceID: _id, data: newData, updatedAt: updateTime }
                    control.forEach((id) => {
                        io.to(id.toString()).emit("control", emitData)
                    })
                } else console.log("invalid key")


            } else if (restTopic === "/ack") {

                const updateTime = new Date()
                const data = JSON.parse(message.toString())
                const dev = await Device.findOne({ createdBy: ownerId, topic: deviceTopic }, "control.recipe")
                const jsonKeys = dev.control.recipe.map(obj => obj.JSONkey)
                const result = map(flip(contains)(jsonKeys), keys(data))
                
                if (data.ack == 1){ // just alive ack
                    const { permissions: { control = [] }, _id } = await Device.updateAck(ownerId, deviceTopic);

                    control.forEach((id) => {
                        io.to(id.toString()).emit("ack", {deviceID: _id, updatedAt: updateTime })
                    })
                } else if (all(equals(true), result)) { // ack some update
                    console.log("saving to db updateState ack")
                    const { permissions: { control = [] }, _id } = await Device.updateStateByDevice(ownerId, deviceTopic, data, updateTime)

                    let newData = {};
                    toPairs(data).forEach(([key, val]) => {
                        newData[key] = { state: val, updatedAt: updateTime, inTransition: false, transitionEnded: updateTime }
                    })
                    const emitData = { deviceID: _id, data: newData, updatedAt: updateTime }
                    control.forEach((id) => {
                        io.to(id.toString()).emit("control", emitData)
                    })
                } else console.log("error missing keys3")


            }
        } catch (err) {
            console.log("error", err)
        }
    }

        // client.end()
    )

    client.on("error", function (err) {
        console.log("mqtt connection error")
        // client.reconnect()
    })
}
