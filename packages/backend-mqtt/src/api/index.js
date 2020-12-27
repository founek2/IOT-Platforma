// import { version } from '../../../../package.json'
import { Router } from 'express'
import auth from './auth'

export default ({ config }) => {
    let api = Router()
    // mount the user resource
    api.use('/auth', auth)

    return api
}
