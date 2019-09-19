import resource from 'framework/src/middlewares/resource-router-middleware'
import UserModel from '../models/user'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import * as rabbitmq from '../service/rabbitmq'

function removeUser(id) {
     return function (doc) {
          return doc.id != id // dont change to !==
     }
}

export default ({ config, db }) =>
     resource({
          /** Property name to store preloaded entity on `request`. */
          // id: 'facet',

          /** For requests with an `id`, you can auto-load the entity.
           *  Errors terminate the request, success sets `req[id] = data`.
           */

          /** GET / - List all entities */
          index({ user, root, query: { type } }, res) {
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
               UserModel.removeUsers(body.formData.USER_MANAGEMENT.selected)
                    .then(result => {
                         if (result.deletedCount >= 1) res.sendStatus(204)
                         else res.status(208).send({ message: 'noneUserFoundForDelete' })
                    })
                    .catch(processError(res))
          },

          updateId({ body, params }, res) {  // tested
               const { id } = params
               if (body.formData.EDIT_USER) {
                    const { EDIT_USER } = body.formData;
                    // if (!EDIT_USER.authType) res.status(208).send({ error: 'missingAuthType' })
                    UserModel.updateUser(id, EDIT_USER).then(() => res.sendStatus(204))


               } else res.sendStatus(500)
          },
     })
