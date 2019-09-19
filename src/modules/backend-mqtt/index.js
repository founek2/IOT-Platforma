import http from 'http'
import express from 'express'
import morgan from 'morgan'
import initializeDb from 'backend/db'
import auth from './api/auth'
import mqttService from './service/mqtt';
import webSockets from './webSockets'
import config  from "backend/config/index.js"
import Jwt from 'framework/src/services/jwt'

const app = express()
app.server = http.createServer(app)

app.io = require("socket.io")(app.server)

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

initializeDb(config, db => {
    Jwt.init(config)

    app.use("/auth", auth)
    
    app.use("/websocket/io", webSockets(app.io))

    app.server.listen( config.portAuth,"localhost", () => {
        console.log(`Started on port ${app.server.address().port}`)

        setTimeout(() => mqttService(app.io), 1000); //init
    })
})