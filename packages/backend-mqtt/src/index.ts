import http from "http";
import express, { Application } from "express";
import morgan from "morgan";
import { Config } from "./types";
import mqttService from "./service/mqtt";
import webSockets from "./service/webSocket";
import config from "./config";
import Jwt from "framework/lib/services/jwt";
import api from "./api";
import bodyParser from "body-parser";
import * as FireBase from "./service/FireBase";
import { Server as serverIO } from "socket.io";
import createMongoUri from "common/lib/utils/createMongoUri";
import mongoose from "mongoose";

import eventEmitter from "./service/eventEmitter";
import initSubscribers from "./subscribers";

interface customApp extends Application {
	server: http.Server;
	io: serverIO;
}

async function startServer(config: Config) {
	Jwt.init(config.jwt);
	FireBase.init(config);
	initSubscribers(eventEmitter);

	await mongoose.connect(createMongoUri(config.db), {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});
	mongoose.set("debug", true);

	const appInstance = express();
	const server = http.createServer(appInstance);
	const app: customApp = Object.assign(appInstance, { server, io: require("socket.io")(server) });

	app.use(express.urlencoded({ extended: true }));
	app.use(morgan("dev"));

	app.use("/api", (req, res, next) =>
		bodyParser.json({
			limit: "100kb",
		})(req, res, next)
	);

	app.use("/websocket/io", webSockets(app.io));

	app.use("/api", api({ config }));

	app.server.listen(config.portAuth, () => {
		console.log(`Started on port ${(app.server?.address() as any).port}`);
		if (app.io) setTimeout(() => mqttService(app.io), 1000); //init
	});

	require("./agenda"); // init
}

startServer(config);
