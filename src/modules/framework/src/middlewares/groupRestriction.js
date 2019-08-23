import { equals, gt } from 'ramda'


export default function (group) {
     return (req, res, next) => {
          if ( req.user.groups.some(equals(group))) {
               next()
          } else res.status(208).send({ error: 'notAllowed' })
     }
}
