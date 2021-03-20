import Device from "../../models/Device";
import resource from "../middlewares/resource-router-middleware";
import tokenAuthMIddleware from "../middlewares/tokenAuth";

export default ({ config, db }) =>
	resource({
		middlewares: {
			index: [tokenAuthMIddleware({ restricted: false })],
		},

		/** GET / - List all entities */
		index({ user }, res) {
			console.log("getting");
			if (user && user.admin) {
				Device.findForAdmin({ sensorsOnly: true }).then((docs) => {
					res.send({ docs });
				});
			} else if (user) {
				// tested
				Device.findForUser(user.id, { sensorsOnly: true }).then((docs) => {
					res.send({ docs });
				});
			} else {
				Device.findPublic({ sensorsOnly: true }).then((docs) => {
					res.send({ docs });
				});
			}
		},
	});
