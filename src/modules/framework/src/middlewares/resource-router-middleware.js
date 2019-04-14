var Router = require('express').Router;

var keyed = ['get', 'read', 'put', 'update', 'patch', 'modify', 'del', 'delete'],
	map = { index:'get', list:'get', read:'get', create:'post', update:'put', patch:'patch' };

module.exports = function ResourceRouter(route) {
	route.mergeParams = route.mergeParams ? true : false;
	var router = Router({mergeParams: route.mergeParams}),
		key, fn, url;

	if (route.middleware) router.use(route.middleware);

	if (route.load) {
		router.param(route.id, function(req, res, next, id) {
			route.load(req, id, function(err, data) {
				if (err) return res.status(404).send(err);
				req[route.id] = data;
				next();
			});
		});
	}

	for (key in route) {
		fn = map[key] || key;
		if (typeof router[fn]==='function') {
			if (key === "read"){
				url = "/:id"
			} else {
				url = ~keyed.indexOf(key) && route.load ? ('/:'+route.id) : '/';
			}

			router[fn](url, route[key]);
		}
	}

	return router;
};

module.exports.keyed = keyed;