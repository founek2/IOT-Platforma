// import { version } from '../../../../package.json'
import { Router } from 'express'
import user from './user'
import device from './device'
import iot from './iot'

export default ({ config, db }) => {
     let api = Router()
     // mount the user resource
     api.use('/user', user({ config }))

     api.use('/device', device({ config }))

     api.use('/iot', iot({config}))

     // perhaps expose some API metadata at the root
     api.get('/', (req, res) => {
          res.json({ version: 0.1 })
     })

     return api
}
