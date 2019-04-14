import { Router } from 'express'
import { errorLog } from 'framework/src/Logger'
import formDataChecker from 'framework/src/middlewares/formDataChecker'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import groupRestriction from 'framework/src/middlewares/groupRestriction'

import fieldDescriptors from 'fieldDescriptors'

export default ({ config, db }) => {
     let router = Router()

     router.post('/api/user', formDataChecker(fieldDescriptors))

     router.use('/api/users', tokenAuthMIddleware())
     router.use('/api/users', groupRestriction('userAdmin'))
	router.delete('/api/users', formDataChecker(fieldDescriptors))
	
	router.use('/api/device', tokenAuthMIddleware())
	router.post('/api/device', formDataChecker(fieldDescriptors))
	router.patch('/api/device', formDataChecker(fieldDescriptors, {ingoreRequired: true}))

     return router
}
