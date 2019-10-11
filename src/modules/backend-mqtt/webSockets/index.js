/*  pokud nemá token -> hodit do public skupiny, pokud má token, tak do userSkupiny
    při dostání dat z mqtt najít všechny kdo mají právo číst a poslat jim data

    spojeni:
    io({
        query: {
            token: 'cde'
        }
    })
*/

import { Router } from 'express'
import Jwt from 'framework/src/services/jwt'

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



        // return next(new Error('authentication error'));
    });

    io.on("connection", socket => {
        console.log("New client connected");
        if (socket.request.user) socket.join(socket.request.user.id)

        socket.join("public")

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });



    return Router()
}