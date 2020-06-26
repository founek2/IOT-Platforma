import resource from 'framework/src/middlewares/resource-router-middleware'
import UserModel from '../models/user'
import processError from 'framework/src/utils/processError'
import tokenAuthMIddleware from 'framework/src/middlewares/tokenAuth'
import formDataChecker from 'framework/src/middlewares/formDataChecker'
import groupRestriction from 'framework/src/middlewares/groupRestriction'

import fieldDescriptors from 'frontend/src/validations/fieldDescriptors.js'
import checkWritePerm from '../middleware/user/checkWritePerm'

import * as types from '../types'
import express from 'express'

function removeUser(id: String) {
     return function (doc: { id: String }) {
          return String(doc.id) !== id // dont change to !==
     }
}

export default ({ config }: { config: types.Config }) =>
     resource({
          middlewares: {
               index: [tokenAuthMIddleware()],
               updateId: [tokenAuthMIddleware(), checkWritePerm(), formDataChecker(fieldDescriptors)],   // TODO add test when user can change his userName
               create: [formDataChecker(fieldDescriptors)],
               delete: [tokenAuthMIddleware(), groupRestriction('admin'), formDataChecker(fieldDescriptors)],
          },
          /** GET / - List all entities */
          index({ user, root, query: { type } }: express.Request, res) {
               // console.log(user)
               if (user && type === "userName") {      // tested
                    console.log("retrieving userNames")
                    UserModel.findAllUserNames().then(docs => {

                         res.send({ data: docs.map(({ _id, info: { userName } }) => ({ _id, userName })) })
                    })
               } else if (root) {
                    UserModel.findAll()
                         .then(docs => {
                              res.send({ users: docs.filter(removeUser(user.id)) })
                         })
                         .catch(processError(res))
               } else if (user && user.admin) {   // tested
                    UserModel.findAllNotRoot()
                         .then(docs => {
                              res.send({ users: docs.filter(removeUser(user.id)) })
                         })
                         .catch(processError(res))
               } else res.sendStatus(500)
          },

          /** POST / - Create a new entity */
          create(req, res) {
               const { formData } = req.body

               if (formData.LOGIN) {    // tested 2
                    UserModel.checkCreditals(formData.LOGIN).then(({ doc, token }) => {
                         const { groups, id, allowedSensors, allowedControlls, info, auth, deviceUser } = doc
                         res.send({
                              user: {
                                   groups,
                                   id,
                                   allowedSensors,
                                   allowedControlls,
                                   info,
                                   auth: { type: auth.type },
                                   deviceUser
                              },
                              token,
                         })
                    }).catch(processError(res))
               } else if (formData.REGISTRATION) {     // tested
                    UserModel.create(formData.REGISTRATION)
                         .then(({ doc, token }) => {
                              const { groups, id, allowedSensors, allowedControlls, info } = doc
                              res.send({
                                   user: {
                                        groups,
                                        id,
                                        allowedSensors,
                                        allowedControlls,
                                        info,
                                   },
                                   token,
                              })
                         })
                         .catch(processError(res))
               } else {
                    res.sendStatus(400)
               }
          },

          /** GET /:id - Return a given entity */
          read({ params, query }, res) {
               const { id } = params
               const { attribute } = query

               if (attribute === "authType" && id) {   // tested
                    UserModel.findByUserName(id)
                         .then(doc => {
                              if (doc) res.send({ authType: doc.auth.type })
                              else res.status(208).send({ error: 'unknownUser' })
                         })
                         .catch(processError(res))
               } else {
                    res.sendStatus(400)
               }
          },

          /** PUT /:id - Create a given entity */

          /** DELETE - Delete a given entities */
          delete({ body }, res) {  // tested
               console.log("data", body.formData)
               UserModel.removeUsers(body.formData.USER_MANAGEMENT.selected)
                    .then(result => {
                         console.log("deleting result> ", result)
                         if (result.deletedCount >= 1) res.sendStatus(204)
                         else res.status(208).send({ message: 'noneUserFoundForDelete' })
                    })
                    .catch(processError(res))
          },

          async updateId({ body, params }, res) {  // tested
               const { id } = params
               if (body.formData.EDIT_USER) {
                    await UserModel.updateUser(id, body.formData.EDIT_USER)
                    res.sendStatus(204)
               } else if (body.formData.FIREBASE_ADD) {
                    await UserModel.addNotifyToken(id, body.formData.FIREBASE_ADD.token)
                    res.sendStatus(204)
               } else res.sendStatus(400)
          },
     })
