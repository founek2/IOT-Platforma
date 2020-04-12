// import { version } from '../../../../package.json'
import { Router } from 'express'
import user from './user'
import device from './device'
import iot from './iot'
import auth from './auth'
import control from './control'
import sensors from './sensors'
import devSensors from './device/sensors'

export default ({ config, db }) => {
     let api = Router()
     // mount the user resource
     api.use('/user', user({ config }))


     api.use('/device/control', control({config}))

     api.use('/device/sensors', sensors({config}))

     api.use('/device/:id/sensors', devSensors({config}))
     
     api.use('/device', device({ config }))

     api.use('/iot', iot({config}))

     api.use('/auth', auth({config}))

     // perhaps expose some API metadata at the root
     api.get('/', (req, res) => {
          res.json({ version: 0.1 })
     })

     return api
}
