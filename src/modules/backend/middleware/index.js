import { Router } from 'express'
import { errorLog } from 'framework/src/Logger'
import formDataChecker from 'framework/src/middlewares/formDataChecker'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import groupRestriction from 'framework/src/middlewares/groupRestriction'

import fieldDescriptors from 'fieldDescriptors'

export default ({ config, db }) => {
     let router = Router()

     router.post('/api/user', formDataChecker(fieldDescriptors))
     router.put('/api/users', tokenAuthMIddleware())
     router.put('/api/user', formDataChecker(fieldDescriptors))

     router.use('/api/users', tokenAuthMIddleware())
     router.use('/api/users', groupRestriction('admin'))
	router.delete('/api/users', formDataChecker(fieldDescriptors))
	
	router.post('/api/device', tokenAuthMIddleware())
     router.post('/api/device', groupRestriction('user'))
     router.put('/api/device', tokenAuthMIddleware())
     router.put('/api/device', groupRestriction('user'))
     router.patch('/api/device', tokenAuthMIddleware())
     router.patch('/api/device', groupRestriction('user'))

     router.get('/api/device', tokenAuthMIddleware({restricted: false}))
     
     router.post('/api/device', formDataChecker(fieldDescriptors))
     router.put('/api/device', formDataChecker(fieldDescriptors))
	router.patch('/api/device', formDataChecker(fieldDescriptors, {ingoreRequired: true}))

     return router
}
