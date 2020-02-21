import Jwt from '../services/jwt'
import mongoose from 'mongoose'
import { equals, T } from 'ramda';
import { infoLog, warningLog } from '../Logger'

import groupsHeritage from 'frontend/src/privileges/groupsHeritage'
import privilegesFactory, { enrichGroups } from 'framework-ui/src/privileges'

privilegesFactory([], groupsHeritage)

export default function (options = { restricted: true}) {
     return (req, res, next) => {
          const { restricted, methods } = options;
          // if (req.url !== '/login') {
          if (methods === undefined || methods.some(method => method === req.method)) {
               const token = req.get('Authorization-JWT')
               if (token) {
                    return Jwt.verify(token)
                         .then(obj => {
                              req.user = obj
                              // next()
                              mongoose  // TODO bad implementation - framework doesnt have User model
                                   .model('User')
                                   .findById(obj.id)
                                   .then(user => {
                                        if (user) {
                                             infoLog(`Verified user=${user.user}, groups=${user.groups.join(",")}`)
                                             req.user = user.toObject()
                                             req.user.groups = enrichGroups(req.user.groups)
                                             if (req.user.groups.some(equals("root"))) req.root = true;
                                             if (req.user.groups.some(equals("admin"))) req.user.admin = true;
                                             next()
                                        } else {
                                             warningLog("userDoesNotExist")
                                             res.status(208).send({ error: 'userDoesNotExist', command: 'logOut' })
                                        }
                                   })
                         })
                         .catch(err => {
                              console.log("token problem", err)
                              res.status(208).send({ error: 'invalidToken' })
                         })
               } else if (!restricted) {
                    next()
               } else {
                    res.status(208).send({ error: 'tokenNotProvided' })
               }
          } else next()
     }
}