// import { version } from '../../../../package.json'
import { Router } from 'express'
import iot from './iot'
import Auth from '../models/Auth'
const crypto = require('crypto');

export default ({ config, db }) => {
    let api = Router()

    api.get("/challenge", async function (req, res) {
        // TODO generate array, save to db, return data + _id

        crypto.randomBytes(32, (err, buf) => {
            if (err) throw err;

            const newAuth = new Auth({ challenge: buf})
            newAuth.save().then(doc => {
                console.log(buf.data, buf)
                res.send({ challenge: buf, id: doc._id })
            })
        });
    })

    api.put("/challenge", async function (req, res) {
        // TODO generate array, save to db, return data + _id
        console.log(req.body, JSON.stringify(req.body))
        crypto.randomBytes(32, (err, buf) => {
            if (err) throw err;

            const newAuth = new Auth({ challenge: buf})
            newAuth.save().then(doc => {
                console.log(buf.data, buf)
                res.send({ challenge: buf, id: doc._id })
            })
        });
    })

    return api
}