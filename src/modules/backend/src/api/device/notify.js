import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import formDataChecker from 'framework/src/middlewares/formDataChecker'

import fieldDescriptors from 'fieldDescriptors'
import checkReadPerm from '../../middleware/device/checkReadPerm'

export default ({ config, db }) =>
    resource({
        mergeParams: true,

        middlewares: {
            index: [tokenAuthMIddleware(),  checkReadPerm(), formDataChecker(fieldDescriptors)],
        },

        // PUT
        update({params: {id}, body: {formData}}, res) {
            console.log("getting")
            console.log(id, formData)
            if (formData.EDIT_NOTIFY_SENSORS) {
                console.log(formData.EDIT_NOTIFY_SENSORS)   // TODO prop type is required....
                res.sendStatus(204);
            }else res.sendStatus(400)
        },
    })
