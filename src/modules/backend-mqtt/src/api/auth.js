import express from 'express'
import Device from 'backend/src/models/Device'
import User from 'backend/src/models/user'

const router = express.Router();

/**
 * password is apiKey
 */

router.post('/user', function (req, res) {
     console.log("/user", req.body)
     const { username, password } = req.body

     if (username.length === 32) {
          Device.login(username).then(b =>
               b ? res.send("allow") : res.send("deny"))
     } else
          User.checkCreditals({ userName: username, password, authType: "passwd" }).then(({ doc }) => {
               if (doc.groups.some(group => group === "root" || group === "admin")) return res.send("allow administrator")
               throw new Error()
          }).catch(() => res.send("deny"))

});

router.post('/vhost', function (req, res) {
     // console.log("/vhost", req.body)
     if (req.body.vhost === "/") return res.send("allow")
     res.send("deny")
});

router.post('/resource', function (req, res) {
     const { resource } = req.body
     // console.log("/resource", req.body, resource === 'queue' || resource === 'exchange' || /^user=.+/.test(username))
     if (resource === 'queue' || resource === 'exchange' || /^user=.+/.test(username)) return res.send("allow")
     console.log("/resource deny")
     res.send("deny")
});

router.post('/topic', async function (req, res) {
     console.log("/topic", req.body)
     const { vhost, username, name, permission, routing_key } = req.body
     if (username.length != 32) return res.send("allow")
     if (name === "amq.topic" && vhost === '/') {
          const { ownerId, topic } = await Device.getOwnerAndTopic(username)

          if (ownerId) {
               if (new RegExp(`\.${ownerId}\..+`).test(routing_key)) {
                    const deviceTopic = `.${ownerId}${topic.replace(/\//g, ".")}`
                    // console.log("moje", new RegExp("^" + deviceTopic + "(\..*)?$").test(routing_key),"^" + deviceTopic + "(/.*)?$" )
                    if ((permission === "write" || permission === "read") && new RegExp("^" + deviceTopic + "(\..*)?$").test(routing_key))
                         return res.send("allow")

               }
          }
     }
     console.log("deny")
     res.send("deny")
});

export default router