import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'

export default ({ config, db }) =>
     resource({
          middlewares: {
               index: [tokenAuthMIddleware()],
          },
          /** GET / - List all entities */
          index({ user }, res) {
              console.log("getting")
            if (user && user.admin) {
                 Device.findForAdmin({controlOnly: true}).then(docs => {
                      res.send({ docs })
                 })
            } else if (user) {  // tested
                 Device.findForUser(user.id, {controlOnly: true}).then(docs => {
                      res.send({ docs })
                 })
            }
       },
     })
