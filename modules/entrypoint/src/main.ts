import * as backendModule from 'backend'
import * as authModule from 'backend-auth'
import * as mqttModule from 'backend-mqtt'
import express, { Express } from "express"
import { logger } from "common"
import http from 'http';
import { AddressInfo } from 'net'
import morgan from 'morgan';
import cors from "cors"
import mongoSanitize from 'express-mongo-sanitize';
import path from "path"
import bodyParser from 'body-parser';


interface Module<T> {
    bindServer: (app: Express, config: T, server: http.Server) => Promise<Express>,
    loadConfig: () => T
}

export async function createServer() {
    let app = express();
    const server = http.createServer(app);

    app.use(express.urlencoded({ extended: true }));

    // Logger
    if (process.env.DEBUG_RABBITMQ) {
        app.use(morgan('dev'));
    } else {
        app.use(/^(?!\/api\/auth\/rabbitmq\/).+/, morgan('dev'));
    }

    // Cors
    app.use(cors())

    app.use(bodyParser.json({
        limit: "100kb",
    }));

    // mongo sanitizer (removes $ from keys)
    app.use('/api', mongoSanitize());

    // server static frontend files
    const frontend_path = path.join(__dirname, '../../frontend/build');
    app.use(express.static(frontend_path));

    // const modules: Module<any>[] = [backendModule, authModule, mqttModule];
    // Promise.all(modules.map((mod) => mod.bindServer(app, mod.loadConfig(), server)))
    await authModule.bindServer(app, authModule.loadConfig())
    await mqttModule.bindServer(app, mqttModule.loadConfig(), server)
    await backendModule.bindServer(app, backendModule.loadConfig())

    app.use("/api/*", (req, res) => {
        res.sendStatus(404)
    })

    // fallback for paths without file extension
    app.get(/\.[^.\/]+$/, (req, res) => res.sendFile(path.join(frontend_path, 'index.html')));

    app.use("*", (req, res) => {
        res.sendStatus(404)
    })

    const port = parseInt(String(process.env.PORT)) || 8085
    server.listen(port, () => {
        const addr = server.address() as AddressInfo;
        logger.info(`Started on port http://${addr.address}:${addr.port}`);
    })
}