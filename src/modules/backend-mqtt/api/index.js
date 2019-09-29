// import { version } from '../../../../package.json'
import { Router } from 'express'
import auth from './auth'
import action from "./action"

export default ({ config, db }) => {
     let api = Router()
     // mount the user resource
     api.use('/auth', auth)

     api.use('/action', action({ config }))

     return api
}
