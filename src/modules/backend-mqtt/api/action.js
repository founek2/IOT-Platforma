import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from 'backend/models/Device'
import { publish } from '../service/mqtt'
import { forEach, flip, contains, map, keys, all, equals } from 'ramda'

export default ({ config, db }) =>
    resource({
        patchId({ body, params: { id } }, res) {
            const { state } = body
            if (state) {
                Device.findById(id, "control createdBy topic").lean().then(doc => {
                    if (doc) {
                        // TODO send to mqtt, there wait for ack, responde and here save to DB
                        const jsonKeys = doc.control.recipe.map(obj => obj.JSONkey)
                        const result = map(flip(contains)(jsonKeys), keys(state))
                        if (all(equals(true), result)) {
                            console.log("publish to", `/${doc.createdBy}${doc.topic}/update`, state)
                            publish(`/${doc.createdBy}${doc.topic}/update`, state)
                            res.sendStatus(200)
                        }  else {
                            throw new Error("Invalid keys")
                        }
                    } else res.sendStatus(500)
                }).catch((err) => {
                    console.log("cant publish:", err)
                    res.sendStatus(500)})
            } else res.sendStatus(500)

        },
    })