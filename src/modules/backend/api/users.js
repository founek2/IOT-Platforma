import resource from 'framework/src/middlewares/resource-router-middleware'
import User from '../models/user'
import processError from 'framework/src/utils/processError'

function removeUser(id) {
     return function(doc) {
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

          /** GET / - List all entities */
          index({ user, root }, res) {
               if (root) {
                    User.findAll()
                         .then(docs => {
                              res.send({ users: docs.filter(removeUser(user.id)) })
                         })
                         .catch(processError(res))
               } else {
                    User.findAllNotRoot()
                         .then(docs => {
                              res.send({ users: docs.filter(removeUser(user.id)) })
                         })
                         .catch(processError(res))
               }
          },

          create({ body }, res) {
               // User.create(body)
               //      .then(result => {
               //           res.send(result);
               //      })
               //      .catch(processError(res));
          },

          update({ body }, res) {
               // User.updateUser(body)
               //      .then(({ message }) => {
               //           res.send({ message });
               //      })
               //      .catch(processError(res));
          },
          /** DELETE /:id - Delete a given entity */
          delete({ body }, res) {
               User.removeUsers(body.formData.USER_MANAGEMENT.selected)
                    .then(result => {
                         if (result.deletedCount >= 1) res.send({ message: 'usersSuccessfullyDeleted' })
                         else res.send({ message: 'noneUserFoundForDelete' })
                    })
                    .catch(processError(res))
          }
     })
