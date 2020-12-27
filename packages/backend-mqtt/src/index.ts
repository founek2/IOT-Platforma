import http from 'http'
import express, { Application } from 'express'
import morgan from 'morgan'
import initializeDb from 'backend/dist/loaders/mongodb'
import { Config } from "backend/dist/types"
import mqttService from './service/mqtt';
import webSockets from './webSockets'
import config from "backend/dist/config/index.js"
import Jwt from 'framework/lib/services/jwt'
import api from './api'
import bodyParser from 'body-parser'
import * as FireBase from './service/FireBase'
import { Server as serverIO } from "socket.io"

interface customApp extends Application {
    server?: http.Server
    io?: serverIO
}

async function startServer(config: Config) {
    Jwt.init(config.jwt)
    FireBase.init(config)
    console.log("config", config)
    await initializeDb(config)

    const app: customApp = express()
    app.server = http.createServer(app)

    app.io = require("socket.io")(app.server)

    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))

    app.use("/api", (req, res, next) =>
        bodyParser.json({
            limit: "100kb"
        })(req, res, next)
    )

    app.use("/websocket/io", webSockets(app.io))

    app.use("/api", api({ config }))

    app.server.listen(config.portAuth, () => {
        console.log(`Started on port ${(app.server?.address() as any).port}`)

        setTimeout(() => mqttService(app.io), 1000); //init
    })
}

startServer(config)