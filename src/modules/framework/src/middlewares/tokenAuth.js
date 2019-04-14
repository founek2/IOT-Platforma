import Jwt from '../services/jwt'
import mongoose from 'mongoose'
import {equals} from 'ramda';

export default function(options) {
     return (req, res, next) => {
		const token = req.get('Authorization-JWT')
		const {soft} = options ? options : {};
          // if (req.url !== '/login') {
          if (token) {
               Jwt.verify(token)
                    .then(obj => {
                         req.user = obj
                         // next()
                         mongoose
                              .model('User')
                              .findById(obj.id)
                              .then(user => {
                                   if (user) {
								req.user = user.toObject()
								if (user.groups.some(equals("root"))) req.root = true;
                                        next()
                                   } else {
                                        res.status(208).send({ error: 'userDoesNotExist', command: 'logOut' })
                                   }
                              })
                    })
                    .catch(err => {
                         console.log(err)
                         res.status(208).send({ error: 'someBug' })
                    })
          } else if (soft) {
               next()
          } else {
               res.status(208).send({ error: 'tokenNotProvided' })
          }
     }
}
