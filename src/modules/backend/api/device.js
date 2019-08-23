import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../models/Device'
import processError from 'framework/src/utils/processError'
import { saveImageBase64, validateFileExtension } from '../service/files'
import { transformSensorsForBE } from 'frontend/src/utils/transform'

export default ({ config, db }) =>
     resource({
          /** Property name to store preloaded entity on `request`. */
          // id: 'facet',

          /** For requests with an `id`, you can auto-load the entity.
           *  Errors terminate the request, success sets `req[id] = data`.
           */

          /** GET /:param - List all entities */
          read({ params, query }, res) {
               const { before } = query
               console.log('read')
               // if (before){
               // 	User.getPositionsBefore(new Date(Number(before)))
               //      .then(docs => {
               // 		console.log('results', docs, params, before);
               // 		res.send({docs})
               //      })
               //      .catch(processError(res));
               // }else {
               // 	res.status(208).send({error: "beforeQueryNotProvided"})
               // }
          },

          /* PUT */
          updateId({ body, params }, res) {
               const { id } = params;
               const { formData } = body;
               if (formData.EDIT_SENSORS) {
                    const { sensors, sampleInterval } = transformSensorsForBE(formData.EDIT_SENSORS);
                    Device.updateSensors(id, sampleInterval, sensors )
                    res.sendStatus(204);
               } else res.sendStatus(500)
          },

          /** POST / - Create a new entity */
          create({ body, user }, res) {
               const { formData } = body

               if (formData.CREATE_DEVICE) {
                    const form = formData.CREATE_DEVICE
                    const image = form.image
                    delete form.image

                    const extension = image.name.split('.').pop()
                    if (!validateFileExtension(extension)) {
                         res.status(208).send({ error: 'notAllowedExtension' })
                    } else
                         Device.createAndAddToUser(form, extension, user.id)
                              .then(doc => {
                                   saveImageBase64(image.data, doc.id, extension)
                                        .then(() => {
                                             const apiKey = doc.apiKey
                                             delete doc.apiKey
                                             res.send({ doc, apiKey })
                                        })
                                        .catch(err => res.sendStatus(500))
                              })
                              .catch(processError(res))

                    // res.send()
               } else res.sendStatus(500)
          },

          /** GET / - List all entities */
          index({ user, root }, res) {
               if (user && user.admin) {
                    Device.findForAdmin().then(docs => {
                         res.send({ docs })
                    })
               } else if (user) {
                    Device.findForUser(user.id, user.devices).then(docs => {
                         res.send({ docs })
                    })
               } else {
                    Device.findPublic().then(docs => {
                         res.send({ docs })
                    })
               }
          },

          patch({ body, user }, res) {
               const { formData } = body

               if (formData.EDIT_DEVICE) {
                    const form = formData.EDIT_DEVICE
                    const image = form.image
                    let extension
                    if (image) {
                         delete form.image
                         extension = image.name.split('.').pop()
                         if (!validateFileExtension(extension)) {
                              res.status(208).send({ error: 'notAllowedExtension' })
                              return
                         }
                    }
                    Device.updateByFormData(formData.EDIT_DEVICE, user.id)
                         .then(() => {
                              if (image) {
                                   saveImageBase64(image.data, form.id, extension).catch(err => {
                                        res.sendStatus(500)
                                   })
                              }
                              res.sendStatus(204)
                         })
                         .catch(processError(res))
               } else res.sendStatus(500)
          },
          /** DELETE /:id - Delete a given entity */
          delete({ body }, res) {
               // User.removeUsers(body.formData.USER_MANAGEMENT.selected)
               //      .then(result => {
               //           if (result.deletedCount >= 1) res.send({ message: 'usersSuccessfullyDeleted' })
               //           else res.send({ message: 'noneUserFoundForDelete' })
               //      })
               //      .catch(processError(res))
          }
     })
