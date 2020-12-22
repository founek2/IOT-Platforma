import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import middleware from './middleware'
import api from './api'
import config from "./config"
import checkAndCreateRoot from 'framework/lib/services/checkAndCreateRoot'
import * as Files from './service/files'
import Jwt from 'framework/lib/services/jwt'
import { devLog } from 'framework/lib/Logger'

const app = express()

app.server = http.createServer(app)

app.io = require("socket.io")(app.server, { path: "/websocket/io" })

// serve static files
// app.use(express.static('deploy'))

app.use(express.urlencoded({ extended: true }))

// logger
app.use("/api", morgan('dev'))

// 3rd party middleware
app.options('*', cors())

// app.use(helmet())

// const corsOptions = {
//      origin: 'https://tracker.iotplatforma.cloud'
// }
// app.use(cors(corsOptions))

function getMaxSize(req) {
    // if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '5mb'
    if (/^\/api\/device(\/|$)/.test(req.url) && (req.method == 'POST' || req.method == 'PUT')) return '5mb'
    return '100kb'
}
app.use((req, res, next) =>
    bodyParser.json({
        limit: getMaxSize(req)
    })(req, res, next)
)

// connect to db
initializeDb(config, db => {
    Jwt.init(config)
    Files.init(config)

    if (process.env.NODE_ENV_TEST !== "true") checkAndCreateRoot() // check for roor existence, if not, then ask for password in terminal

    // internal middleware
    app.use(middleware({ config, db }))

    // api router
    app.use('/api', api({ config }))

    // app.use("/auth", auth)


    // app.use("/websocket", webSockets(app.io))

    if (process.env.NODE_ENV === "development") {
        const proxy = require("http-proxy-middleware");
        var wsProxy = proxy('/socket.io', {
            target: 'ws://localhost:8084',
            // pathRewrite: {
            //  '^/websocket' : '/socket',        // rewrite path.
            //  '^/removepath' : ''               // remove path.
            // },
            changeOrigin: true, // for vhosted sites, changes host header to match to target's host
            ws: true, // enable websocket proxy
            logLevel: 'info'
        });

        app.use(wsProxy);
        app.server.on("upgrade", wsProxy.upgrade)
        devLog("Proxy enabled")
    }

    app.use("/api/*", (req, res) => res.sendStatus(404))

    app.server.listen(config.port, () => {
        console.log(`Started on port ${app.server.address().port}`)

    })

    process.once('SIGINT', function (code) {
        console.log('SIGINT received...');
        app.server.close();
        db.close();
    });

    process.once('SIGTERM', function (code) {
        console.log('SIGTERM received...');
        app.server.close();
        db.close();
    });

    process.once('SIGHUP', function (code) {
        console.log('SIGHUP received...');
        app.server.close();
        db.close();
    });
})

export default app
