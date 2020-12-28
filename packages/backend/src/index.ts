import http from 'http'
import express, { Application } from 'express'
import config from "./config"
import checkAndCreateRoot from 'framework/lib/services/checkAndCreateRoot'
import * as Files from './service/files'
import Jwt from 'framework/lib/services/jwt'
import { devLog } from 'framework/lib/logger'
import { Config } from "./types"
import loadersInit from "./loaders"
import mongoose from "mongoose"
import initPrivileges from 'framework-ui/lib/privileges'
import { groupsHeritage, allowedGroups } from 'common/lib/constants/privileges'

export const routes = {
    user: {
        allowedGroups: allowedGroups.user
    },
    admin: {
        allowedGroups: allowedGroups.admin
    },
    root: {
        allowedGroups: allowedGroups.root
    }
};

initPrivileges(routes, groupsHeritage)

interface customApp extends Application {
    server?: http.Server
}

async function startServer(config: Config) {
    Jwt.init(config.jwt)
    Files.init(config)

    const app: customApp = express()

    app.server = http.createServer(app)
    if (!app.server) throw Error("Unable to create server")

    await loadersInit({ app, config })

    // if (process.env.NODE_ENV_TEST !== "true") checkAndCreateRoot() // check for roor existence, if not, then ask for password in terminal

    if (process.env.NODE_ENV === "development") {
        console.log("Socket redirect enabled")
        const proxy = require("http-proxy-middleware");
        var wsProxy = proxy('/socket.io', {
            target: 'ws://localhost:8084',
            changeOrigin: true, // for vhosted sites, changes host header to match to target's host
            ws: true, // enable websocket proxy
            logLevel: 'error'
        });

        app.use(wsProxy);
        app.server.on("upgrade", wsProxy.upgrade)
        devLog("Proxy enabled")
    }

    app.server.listen(config.port, () => {
        console.log(`Started on port ${(app.server?.address() as any).port}`)

    })

    process.once('SIGINT', shutDown(app, mongoose.connection));
    process.once('SIGTERM', shutDown(app, mongoose.connection));
    process.once('SIGHUP', shutDown(app, mongoose.connection));
}

startServer(config)

function shutDown(app: customApp, connection: mongoose.Connection) {
    return async (code: NodeJS.Signals) => {
        console.log(code, 'received...');
        app.server?.close();
        await connection.close();
        process.exit(0);
    }
}