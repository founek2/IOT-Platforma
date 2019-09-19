import resource from 'framework/src/middlewares/resource-router-middleware'
import Device from '../models/Device'
import processError from 'framework/src/utils/processError'
import { saveImageBase64, validateFileExtension, deleteImage } from '../service/files'
import { transformSensorsForBE } from 'frontend/src/utils/transform'

export default ({ config, db }) =>
     resource({
          /** GET /:param - List all entities */
          read({ params: { id }, query: { from, to = new Date(), type }, user }, res) {
               if (type === "sensors") {
                    if (user && user.admin) {
                         Device.getSensorsDataForAdmin(id, new Date(Number(from)), new Date(Number(to))).then(docs => {
                              res.send({ data: docs })
                              // res.sendStatus(204)
                         }).catch(processError(res))
                    } else {
                         Device.getSensorsData(id, new Date(Number(from)), new Date(Number(to)), user).then(docs => {
                              res.send({ data: docs })
                              // res.sendStatus(204)
                         }).catch(processError(res))
                    }
               } else if (type === "apiKey") {
                    Device.getApiKey(id, user).then((apiKey) => res.send({ apiKey })).catch(processError(res))
               } else res.sendStatus(404)
          },

          /* PUT */
          updateId({ body, params: { id }, user }, res) {
               const { formData } = body;

               if (formData.EDIT_DEVICE) {   // tested
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
                    Device.updateByFormData(id, formData.EDIT_DEVICE, extension, user)
                         .then(async (origImgPath) => {
                              try {
                                   if (image && origImgPath)
                                        await deleteImage(origImgPath)
                              } catch (e) { }

                              try {
                                   if (image) {
                                        await saveImageBase64(image.data, id, extension)
                                   }
                                   res.sendStatus(204)
                              } catch (e) {
                                   res.sendStatus(500)
                              }
                         })
                         .catch(processError(res))
               } else if (formData.EDIT_SENSORS) {     // tested
                    const { sensors, sampleInterval } = transformSensorsForBE(formData.EDIT_SENSORS);
                    Device.updateSensorsRecipe(id, sampleInterval, sensors, user)
                         .then(() => res.sendStatus(204))
                         .catch(processError(res))
               } else if (formData.EDIT_PERMISSIONS) {      // tested
                    Device.updatePermissions(id, formData.EDIT_PERMISSIONS, user)
                         .then(() => res.sendStatus(204))
                         .catch(processError(res))
               } else res.sendStatus(500)
          },

          /** POST / - Create a new entity */
          create({ body, user }, res) {
               const { formData } = body

               if (formData.CREATE_DEVICE) {      // tested, not saving of file
                    const form = formData.CREATE_DEVICE
                    const image = form.image
                    delete form.image

                    const extension = image.name.split('.').pop()
                    if (!validateFileExtension(extension)) {
                         res.status(208).send({ error: 'notAllowedExtension' })
                    } else
                         Device.create(form, extension, user.id)
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
               } else if (user) {  // tested
                    Device.findForUser(user.id, user.devices).then(docs => {
                         res.send({ docs })
                    })
               } else {
                    Device.findPublic().then(docs => {
                         res.send({ docs })
                    })
               }
          },

          patchId({ body, user, params }, res) {
               // const { formData } = body
               // const { id } = params

               // if (formData.EDIT_DEVICE) {
               //      const form = formData.EDIT_DEVICE
               //      const image = form.image
               //      let extension
               //      if (image) {
               //           delete form.image
               //           extension = image.name.split('.').pop()
               //           if (!validateFileExtension(extension)) {
               //                res.status(208).send({ error: 'notAllowedExtension' })
               //                return
               //           }
               //      }
               //      Device.updateByFormData(id, formData.EDIT_DEVICE, extension, user)
               //           .then(async (origImgPath) => {
               //                try {
               //                     if (image && origImgPath)
               //                          await deleteImage(origImgPath)
               //                } catch (e) { }

               //                try {
               //                     if (image) {
               //                          await saveImageBase64(image.data, id, extension)
               //                     }
               //                     res.sendStatus(204)
               //                } catch (e) {
               //                     res.sendStatus(500)
               //                }
               //           })
               //           .catch(processError(res))
               // } else res.sendStatus(500)
          },
          /** DELETE - Delete a given entities */
          deleteId({ params, user }, res) {  // tested, 2
               const { id } = params;
               Device
                    .delete(id, user)
                    .then(({ imgPath }) => deleteImage(imgPath))
                    .then(() => res.sendStatus(204))
                    .catch(processError(res))
          }
     })
