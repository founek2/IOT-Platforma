// import { version } from '../../../../package.json'
import { Router } from "express";
import auth from "./auth";
import actions from "./actions";

export default ({ config }) => {
	let api = Router();
	// mount the user resource
	api.use("/auth", auth);

	api.use("/actions", actions);

	return api;
};
