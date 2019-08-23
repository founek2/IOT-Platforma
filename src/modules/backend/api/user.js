import resource from 'framework/src/middlewares/resource-router-middleware'
import UserModel from '../models/user'
import processError from 'framework/src/utils/processError'
import { assocPath, o, omit } from 'ramda'
import * as rabbitmq from '../service/rabbitmq'

export default ({ config, db }) =>
     resource({
          /** Property name to store preloaded entity on `request`. */
          // id: 'facet',

          /** For requests with an `id`, you can auto-load the entity.
           *  Errors terminate the request, success sets `req[id] = data`.
           */

          /** GET / - List all entities */
          index({ params }, res) {
               console.log('index')
               res.json()
          },

          /** POST / - Create a new entity */
          create(req, res) {
               const { formData } = req.body

               if (formData.LOGIN) {
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
               } else if (formData.REGISTRATION) {
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

               if (attribute && id) {
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

          /** DELETE /:id - Delete a given entity */
          delete({ facet }, res) {
               console.log('delte')
               res.sendStatus(204)
          },
          updateId({ body, params }, res) {
               const { id } = params
               if (body.formData.EDIT_USER) {
                    const { EDIT_USER } = body.formData;
                    console.log("form", EDIT_USER)
                    // if (!EDIT_USER.authType) res.status(208).send({ error: 'missingAuthType' })
                    UserModel.updateUser(id, body.formData.EDIT_USER).then(() => res.sendStatus(204))


               } else res.sendStatus(500)
          },

          patchId({ body, params }, res) {
               const { id } = params
               if (body.formData.EDIT_DEVICE_USER) {
                    const formData = body.formData.EDIT_DEVICE_USER
                    UserModel.updateUser(id, { deviceUser: formData }).then(async () => {
                         // Create user in rabbitmq with regexú ^username.*
                         let error = await rabbitmq.addUser(formData.userName, formData.password)
                         if (error) return res.status(208).send({ error })

                         error = await rabbitmq.setPermissions(formData.userName, '".*" ".*" ".*"')
                         if (error) return res.status(208).send({ error })

                         error = await rabbitmq.setTopicPermissions(formData.userName)
                         if (error) return res.status(208).send({ error })

                         res.sendStatus(204)

                    })
               } else res.sendStatus(500)
          }
     })
