// import { version } from '../../../../package.json'
import { Router } from 'express'
import iot from './iot'
import Device from '../models/Device'

export default ({ config, db }) => {
    let api = Router()

    api.get("/topic", async function ({ query: { API_KEY } }, res) {
        console.log(API_KEY)
        if (API_KEY) {
            const doc = await Device.getTopicByApiKey(API_KEY)
            if (doc) {
                console.log("doc", doc)
                res.send("/" + doc.createdBy + doc.topic)
            } else res.sendStatus(404)
        } else res.sendStatus(500)
    })

    return api
}