import Device from "../../models/Device";

export default function (options) {
	return async ({ params: { id }, user = {} }, res, next) => {
		console.log("blabla");
		if (!(await Device.checkExist(id))) return res.status(404).send({ error: "invalidDeviceId" });

		if (user.admin) return next();

		if (await Device.checkControlPerm(id, user.id)) return next();

		res.status(403).send({ error: "invalidPermissions" });
	};
}
