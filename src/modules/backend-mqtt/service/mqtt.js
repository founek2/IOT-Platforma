import mqtt from 'mqtt'
// import { getConfig } from './config'
import config from "backend/config/index.js"
import Device from 'backend/models/Device'

export default (io) => {
    console.log("connecting to mqtt")
    const client = mqtt.connect('mqtt://localhost', { username: `${config.mqttUser}`, password: `${config.mqttPassword}` })

    client.on('connect', function () {
        client.subscribe('#', function (err) {
            if (!err) {
                console.log("subscribed to #")
            } else console.log("mqtt error:", err)
        })
    })

    client.on('message', async function (topic, message) {
        const idObj = topic.match(/^(?:[^\/]*\/){1}([^\/]*)/)
        const topicObj = topic.match(/^(?:[^\/]*\/){2}(.*)\//)
        if (idObj && topicObj && topic.match(/\/save$/)) {
            try {
                const data = JSON.parse(message.toString())
                const updateTime = new Date()
                const { deviceID, publicRead } = await Device.updateSensorsData(idObj[1], "/" + topicObj[1], data, updateTime)
                // TODO pokud má public read, tak poslat i do veřejné místnosti
                const emitData = { deviceID, data, updatedAt: updateTime }
                io.to(idObj[1]).emit("sensors", emitData)
                if (publicRead) io.to("public").emit("sensors", emitData)
                console.log("emmiting to public", publicRead)
            } catch (err) {
                console.log("error", err)
            }

            console.log("message", message.toString(), topic)
        }
        // client.end()
    })

    client.on("error", function (err) {
        console.log("mqtt connection error")
        // client.reconnect()
    })
}
