// import { version } from '../../../../package.json'
import { Router } from "express";
import auth from "./auth";
import actions from "./actions";
import webSocket from "./socket";

export default ({ io }) => {
	let api = Router();
	// mount the user resource
	api.use("/auth", auth);

	api.use("/actions", actions);

	// api.use("/socket", webSocket(io));
	webSocket(io);
	return api;
};
