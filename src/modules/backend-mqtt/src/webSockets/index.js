import { Router } from 'express'
import Jwt from 'framework/src/services/jwt'
import Device from 'backend/src/models/Device'
import { publish } from '../service/mqtt'

export default (io) => {
    io.use((socket, next) => {
        let token = socket.handshake.query.token;
        console.log("middleware loging io")
        Jwt.verify(token)
            .then((payload) => {
                socket.request.user = payload
                next()
            })
            .catch(() => next())
    });

    io.on("connection", socket => {
        console.log("New client connected", socket.request.user ? socket.request.user.id : "unknown");
        if (socket.request.user) socket.join(socket.request.user.id)

        socket.join("public")

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        socket.on("updateState", (body, id, fn) => {
            const formData = body.formData
            Device.findById(id, "topic control.recipe createdBy ").lean().then(doc => {
                console.log("doc", doc, id)
                if (doc) {
                    const jsonKeys = doc.control.recipe.map(obj => obj.JSONkey)


                    const form = formData.CHANGE_DEVICE_STATE_SWITCH || formData.CHANGE_DEVICE_STATE_RGB
                    if (jsonKeys.some(key => form.JSONkey === key)) {
                        fn({
                            data: {
                                 current: {
                                      data: {
                                           [form.JSONkey]: { state: form.state, inTransition: true, transitionStarted: new Date() }
                                      }
                                 }
                            }
                       })

                        console.log("publish to", `/${doc.createdBy}${doc.topic}/update`, form.state)
                        publish(`/${doc.createdBy}${doc.topic}/update`, { [form.JSONkey]: form.state })
                    } else fn({ error: "invalidKey" })

                } else throw new Error("error")
            }).catch((err) => {
                console.log("cant publish:", err)
                fn({ error: "error" })
            })
        });
    });



    return Router()
}