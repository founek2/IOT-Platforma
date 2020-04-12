import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'

export default ({ config, db }) =>
    resource({
        mergeParams: true,

        middlewares: {
            index: [tokenAuthMIddleware()],
        },

        /** GET / - List all entities */
        update({params: {id}, body: {formData}}, res) {
            console.log("getting")
            console.log(id, formData)

            res.sendStatus(204)
        },
    })
