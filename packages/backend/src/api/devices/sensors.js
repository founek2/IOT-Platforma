import resource from 'framework/lib/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/lib/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/lib/middlewares/tokenAuth'

export default ({ config, db }) =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware({ restricted: false })],
        },

        /** GET / - List all entities */
        index({ user }, res) {
            console.log("getting")
            if (user && user.admin) {
                Device.findForAdmin({ sensorsOnly: true }).then(docs => {
                    res.send({ docs })
                })
            } else if (user) {  // tested
                Device.findForUser(user.id, { sensorsOnly: true }).then(docs => {
                    res.send({ docs })
                })
            } else {
                Device.findPublic({ sensorsOnly: true }).then(docs => {
                    res.send({ docs })
                })
            }
        },
    })
