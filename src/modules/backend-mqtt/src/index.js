import http from 'http'
import express from 'express'
import morgan from 'morgan'
import initializeDb from 'backend/src/db'
import auth from './api/auth'
import mqttService from './service/mqtt';
import webSockets from './webSockets'
import config from "backend/config/index.js"
import Jwt from 'framework/src/services/jwt'
import api from './api'
import bodyParser from 'body-parser'
import * as FireBase from './service/FireBase'

const app = express()
app.server = http.createServer(app)

app.io = require("socket.io")(app.server)

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use("/api", (req, res, next) =>
    bodyParser.json({
        limit: "100kb"
    })(req, res, next)
)

initializeDb(config, db => {
    Jwt.init(config)
    FireBase.init(config)

    app.use("/websocket/io", webSockets(app.io))

    app.use("/api", api({ config }))

    app.server.listen(config.portAuth, "localhost", () => {
        console.log(`Started on port ${app.server.address().port}`)

        setTimeout(() => mqttService(app.io), 1000); //init
    })
})