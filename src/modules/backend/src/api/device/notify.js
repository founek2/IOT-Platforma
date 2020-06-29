import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import formDataChecker from 'framework/src/middlewares/formDataChecker'

import fieldDescriptors from 'fieldDescriptors'
import checkReadPerm from '../../middleware/device/checkReadPerm'
import checkWritePerm from '../../middleware/device/checkWritePerm'
import Notify from '../../models/Notification'
import { transformNotifyForBE } from 'frontend/src/utils/transform'

function checkIndex() {
    return (req, res, next) => {
        if (req.query.type === "sensors")
            return checkReadPerm()(req, res, next)
        if (req.query.type === "control" && req.query.JSONkey)
            return checkWritePerm()(req, res, next)

        res.status(208).send({ error: 'InvalidParam' })
    }
}

export default ({ config, db }) =>
    resource({
        mergeParams: true,

        middlewares: {
            update: [tokenAuthMIddleware(), checkReadPerm(), formDataChecker(fieldDescriptors)],
            index: [tokenAuthMIddleware(), checkIndex()],
        },

        index({ params: { id }, user, query: { type, JSONkey } }, res) {
            console.log("index", type, JSONkey)

            if (type === "sensors") {
                Notify.getSensors(id, user.id).then(doc => {
                    // console.log("items", doc.items)
                    res.send({
                        doc: {
                            items: doc && doc.items ? doc.items : []
                        }
                    });
                })
            }

            if (type === "control") {
                Notify.getControl(id, user.id, JSONkey).then(doc => {
                    // console.log("items", doc.items)
                    res.send({
                        doc: {
                            items: doc && doc.items ? doc.items : []
                        }
                    });
                })
            }
        },

        // PUT
        update({ params: { id }, body: { formData }, user }, res) {
            if (formData.EDIT_NOTIFY_SENSORS) {
                const { sensors } = transformNotifyForBE(formData.EDIT_NOTIFY_SENSORS)
                Notify.addOrUpdateSensors(user.id, id, sensors).then((result) => {
                    res.sendStatus(204);
                }).catch((e) => {
                    console.log("err", e)
                    res.sendStatus(500);
                })

            } else if (formData.EDIT_NOTIFY_CONTROL) {
                const { sensors, key } = transformNotifyForBE(formData.EDIT_NOTIFY_CONTROL)
                console.log("transformed", transformNotifyForBE(formData.EDIT_NOTIFY_CONTROL))
                Notify.addOrUpdateControl(user.id, id, key, sensors).then((result) => {
                    res.sendStatus(204);
                }).catch((e) => {
                    console.log("err", e)
                    res.sendStatus(500);
                })
            } else res.sendStatus(400)
        },
    })
