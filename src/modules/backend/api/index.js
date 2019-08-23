import { version } from '../../../../package.json'
import { Router } from 'express'
import user from './user'
import users from './users'
import device from './device'

export default ({ config, db }) => {
     let api = Router()
     // mount the user resource
     api.use('/user', user({ config }))

     api.use('/users', users({ config }))

     api.use('/device', device({ config }))

     // perhaps expose some API metadata at the root
     api.get('/', (req, res) => {
          res.json({ version })
     })

     return api
}
