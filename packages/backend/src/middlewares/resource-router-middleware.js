import asyncHandler from "express-async-handler";
var Router = require("express").Router;

var keyed = ["get", "read", "put", "update", "patch", "modify", "del", "delete"],
	map = {
		index: "get",
		list: "get",
		read: "get",
		create: "post",
		update: "put",
		updateId: "put",
		patch: "patch",
		patchId: "patch",
		deleteId: "delete",
	};

// TODO add middleware for ID checking (24 lenght) -> then remove from Models
export default function ResourceRouter(route) {
	const router = Router({ mergeParams: !!route.mergeParams });

	if (route.middleware) router.use(route.middleware);
	if (route.middlewares) mapper(route.middlewares, router);

	if (route.load) {
		router.param(route.id, function (req, res, next, id) {
			route.load(req, id, function (err, data) {
				if (err) return res.status(404).send(err);
				req[route.id] = data;
				next();
			});
		});
	}

	// for (key in route) {
	// 	fn = map[key] || key;
	// 	if (typeof router[fn]==='function') {
	// 		if (key === "read" || key === "updateId" || key === "patchId" || key === "deleteId"){
	// 			url = "/:id"
	// 		} else {
	// 			url = ~keyed.indexOf(key) && route.load ? ('/:'+route.id) : '/';
	// 		}

	// 		router[fn](url, route[key]);
	// 	}
	// }
	mapper(route, router);

	return router;
}

export function mapper(route, router) {
	for (const key in route) {
		// fn = map[key] || key;
		// if (typeof router[fn]==='function') {
		// 	if (key === "read" || key === "updateId" || key === "patchId" || key === "deleteId"){
		// 		url = "/:id"
		// 	} else {
		// 		url = ~keyed.indexOf(key) && route.load ? ('/:'+route.id) : '/';
		// 	}

		// 	router[fn](url, route[key]);
		// }
		if (typeof route[key] === "function") {
			apply(key, route[key], router, route);
		} else if (Array.isArray(route[key])) {
			for (const i in route[key]) {
				apply(key, route[key][i], router, route[key]);
			}
		}
	}
}

function apply(key, fn, router, route) {
	const method = map[key] || key;
	if (typeof router[method] != "function") return;

	let url;
	if (key === "read" || key === "updateId" || key === "patchId" || key === "deleteId") {
		url = "/:id";
	} else {
		url = ~keyed.indexOf(key) && route.load ? "/:" + route.id : "/";
	}

	router[method](url, asyncHandler(fn));
}
