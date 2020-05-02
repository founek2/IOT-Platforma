// import { version } from '../../../../package.json'
import { Router } from 'express'
import user from './user'
import device from './device'
import iot from './iot'
import auth from './auth'
import control from './devices/control'
import sensors from './devices/sensors'
import notify from './device/notify'

export default ({ config, db }) => {
     let api = Router()
     // mount the user resource
     api.use('/user', user({ config }))


     api.use('/devices/control', control({config}))

     api.use('/devices/sensors', sensors({config}))

     api.use('/device/:id/notify', notify({config}))

     api.use('/device', device({ config }))

     api.use('/iot', iot({config}))

     api.use('/auth', auth({config}))

     // perhaps expose some API metadata at the root
     api.get('/', (req, res) => {
          res.json({ version: 0.1 })
     })

     return api
}
