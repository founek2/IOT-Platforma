import http from "http";
import express, { Application } from "express";
import morgan from "morgan";
import { Config } from "./types";
import mqttService from "./services/mqtt";
// import webSockets from "./services/webSocket";
import { JwtService } from "common/lib/services/jwtService";
import api from "./api";
import bodyParser from "body-parser";
import * as FireBase from "./services/FireBase";
import { Server as serverIO } from "socket.io";
import createMongoUri from "common/lib/utils/createMongoUri";
import mongoose from "mongoose";
import config from "common/lib/config";

import eventEmitter from "./services/eventEmitter";
import initSubscribers from "./subscribers";

interface customApp extends Application {
	server: http.Server;
	io: serverIO;
}

async function startServer(config: Config) {
	JwtService.init(config.jwt);
	FireBase.init(config);
	initSubscribers(eventEmitter);

	await mongoose.connect(createMongoUri(config.db), {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});
	mongoose.set("debug", process.env.NODE_ENV === "development");

	const appInstance = express();
	const server = http.createServer(appInstance);
	const app: customApp = Object.assign(appInstance, { server, io: new serverIO(server, { path: "/socket.io" }) });

	app.use(express.urlencoded({ extended: true }));
	app.use(morgan("dev"));

	app.use("/api", (req, res, next) =>
		bodyParser.json({
			limit: "100kb",
		})(req, res, next)
	);

	app.use("/api", api({ io: app.io }));

	app.server.listen(config.portAuth, () => {
		console.log(`Started on port ${(app.server?.address() as any).port}`);
		if (app.io) setTimeout(() => mqttService(app.io, config), 1000); //init
	});
}

startServer(config);
