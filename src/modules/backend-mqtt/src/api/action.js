import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from 'backend/src/models/Device'
import { publish } from '../service/mqtt'
import { forEach, flip, contains, map, keys, all, equals } from 'ramda'

export default ({ config, db }) =>
    resource({
        // patchId({ body, params: { id } }, res) {
        //     const formData = body   // {JSONkey: rgb, state: patchState}
        //     if (formData) {
        //         Device.findById(id, "topic control.recipe createdBy ").lean().then(doc => {
        //             console.log("doc", doc)
        //             if (doc) {
        //                 const jsonKeys = doc.control.recipe.map(obj => obj.JSONkey)

        //                     if (jsonKeys.some(key => formData.JSONkey === key)){
        //                         res.sendStatus(200) // response first -> mqtt is otherwise faster

        //                     console.log("publish to", `/${doc.createdBy}${doc.topic}/update`, formData.state)
        //                     publish(`/${doc.createdBy}${doc.topic}/update`,  {[formData.JSONkey]: formData.state})
        //                 }else  throw new Error("Invalid key")
        //             } else res.sendStatus(500)
        //         }).catch((err) => {
        //             console.log("cant publish:", err)
        //             res.sendStatus(500)})
        //     } else res.sendStatus(500)

        // },
    })