import express, { Application, Request } from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import api from "../api";
import { Config } from "../types";

export default async ({ app, config }: { app: Application; config: Config }) => {
	app.use(express.urlencoded({ extended: true }));

	// logger
	app.use("/api", morgan("dev") as any);

	// 3rd party middleware
	app.options("*", cors() as any);

	// app.use(helmet())

	// const corsOptions = {
	//      origin: 'https://tracker.iotplatforma.cloud'
	// }
	// app.use(cors(corsOptions))

	function getMaxSize(req: Request) {
		// if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '5mb'
		if (/^\/api\/device(\/|$)/.test(req.url) && (req.method == "POST" || req.method == "PUT")) return "5mb";
		return "100kb";
	}
	app.use((req, res, next) =>
		bodyParser.json({
			limit: getMaxSize(req),
		})(req, res, next)
	);

	// api router
	app.use("/api", api({ config }));

	app.use("/api/*", (req, res) => res.sendStatus(404));

	return app;
};
