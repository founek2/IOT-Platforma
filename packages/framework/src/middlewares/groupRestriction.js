import { equals, gt } from 'ramda'
import { infoLog, warningLog } from '../Logger'

export default function (group, { methods } = {}) {
     return (req, res, next) => {
          if (methods === undefined || methods.some(method => method === req.method)) {
               infoLog("Checking group restriction")
               if (req.user.groups.some(equals(group))) {
                    next()
               } else {
                    warningLog("notAllowed")
                    res.status(208).send({ error: 'notAllowed' })
               }
          } else next()
     }
}
