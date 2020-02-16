import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../models/Device'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'

export default ({ config, db }) =>
     resource({
          /** GET / - List all entities */
          index({ user, root }, res) {
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
