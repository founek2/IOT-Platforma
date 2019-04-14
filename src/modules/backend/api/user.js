import resource from 'framework/src/middlewares/resource-router-middleware'
import UserModel from '../models/user'
import { areGroupsAllowed } from 'framework-ui/src/privileges'
import processError from 'framework/src/utils/processError'

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
                         const { groups, id, allowedSensors, allowedControlls, ...other } = doc
                         res.send({
                              user: {
                                   groups,
                                   id,
                                   allowedSensors,
                                   allowedControlls,
                                   info: other
                              },
                              token,
                         })
                    }).catch(processError(res))
               } else if (formData.REGISTRATION) {
                    UserModel.create(formData.REGISTRATION)
                         .then(({ doc, token }) => {
                              const { groups, id, allowedSensors, allowedControlls, ...other } = doc
                              res.send({
                                   user: {
                                        groups,
                                        id,
                                        allowedSensors,
                                        allowedControlls,
                                        info: other
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
          }
     })
