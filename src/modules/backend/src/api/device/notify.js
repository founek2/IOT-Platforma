import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import formDataChecker from 'framework/src/middlewares/formDataChecker'

import fieldDescriptors from 'fieldDescriptors'
import checkReadPerm from '../../middleware/device/checkReadPerm'
import Notify from '../../models/Notification'
import { transformNotifyForBE } from 'frontend/src/utils/transform'

export default ({ config, db }) =>
    resource({
        mergeParams: true,

        middlewares: {
            update: [tokenAuthMIddleware(), checkReadPerm(), formDataChecker(fieldDescriptors)],
            index: [tokenAuthMIddleware(), checkReadPerm()],
        },

        index({ params: { id }, user }, res) {
            console.log("index", id, user.id)
            
            Notify.getSensors(id, user.id).then(doc => {
                // console.log("items", doc.items)
                res.send({doc: {
                    items: doc && doc.items ? doc.items : []
                }});
            })
        },

        // PUT
        update({ params: { id }, body: { formData }, user }, res) {
            console.log("getting")
            console.log(id, formData)
            if (formData.EDIT_NOTIFY_SENSORS) {
                console.log(formData.EDIT_NOTIFY_SENSORS)   // TODO prop type is required....
                console.log(transformNotifyForBE(formData.EDIT_NOTIFY_SENSORS))
                const { sensors } = transformNotifyForBE(formData.EDIT_NOTIFY_SENSORS)
                Notify.addOrUpdateSensors(user.id, id, sensors).then((result) => {
                    console.log("result", result)
                    res.sendStatus(204);
                }).catch((e) => {
                    console.log("err", e)
                    res.sendStatus(500);
                })

            } else res.sendStatus(400)
        },
    })
