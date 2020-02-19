import { Router } from 'express'
import { errorLog } from 'framework/src/Logger'
import formDataChecker from 'framework/src/middlewares/formDataChecker'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import groupRestriction from 'framework/src/middlewares/groupRestriction'

import fieldDescriptors from 'fieldDescriptors'

export default ({ config, db }) => {
     let router = Router()

     // router.use('/api/user', tokenAuthMIddleware({ methods: ["GET","DELETE", "PUT"] }))
     // router.get('/api/user', tokenAuthMIddleware({ restricted: false }))
     // router.get('/api/user/*', tokenAuthMIddleware())
     // router.use('/api/user', groupRestriction('admin', { methods: ["DELETE", "PUT"] }))
     // router.get('/api/user', groupRestriction('admin'))
     // router.use('/api/user', formDataChecker(fieldDescriptors, { methods: ["POST", "DELETE", "PUT"] }))

     router.get('/api/device/control', tokenAuthMIddleware())

     // router.use('/api/device', tokenAuthMIddleware({ methods: ["POST", "PUT", "PATCH", "DELETE"] }))
     // router.get('/api/device', tokenAuthMIddleware({ restricted: false, methods: ["GET"] }))
     // router.get('/api/device/*', tokenAuthMIddleware({ restricted: false }))
     // router.use('/api/device', formDataChecker(fieldDescriptors, { methods: ["POST", "PUT", "PATCH"] }))
     // router.patch('/api/device/*', formDataChecker(fieldDescriptors, { ingoreRequired: true }))

     return router
}
