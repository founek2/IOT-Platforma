import express from "express";
import Device from "backend/dist/models/Device";
import User from "backend/dist/models/user";
import { DeviceModel } from "common/src/models/device";
import device from "../subscribers/device";

const router = express.Router();

function sendDeny(path, res) {
	console.log(path, "deny");
	res.send("deny");
}

function isGuest(userName) {
	return userName.startsWith("guest=");
}

function isUser(userName) {
	return !isGuest(userName) && !isDevice(userName);
}
function isDevice(userName) {
	return userName.startsWith("device=");
}

function splitUserName(userName) {
	return removeUserNamePrefix(userName).split("/");
}

function removeUserNamePrefix(userName) {
	return userName.replace(/^[^=]+=/, "");
}

/**
 * password is apiKey
 */
router.post("/user", async function (req, res) {
	// console.log('/user', req.body);
	const { username, password } = req.body;
	console.info("username=" + username, "password=" + password);
	if (isDevice(username)) {
		const [topicPrefix, deviceId] = splitUserName(username);
		console.log("loging", topicPrefix, deviceId, password);
		const success = await DeviceModel.login(topicPrefix, deviceId, password);
		return success ? res.send("allow") : sendDeny("/user", res);
	} else if (isUser(username)) {
		User.checkCreditals({ userName: username, password, authType: "passwd" })
			.then(({ doc }) => {
				if (doc.groups.some((group) => group === "root" || group === "admin"))
					return res.send("allow administrator");
				throw new Error();
			})
			.catch(() => sendDeny("/user", res));
	} else {
		res.send("allow");
	}
});

router.post("/vhost", function (req, res) {
	// console.log("/vhost", req.body)
	if (req.body.vhost === "/") return res.send("allow");
	sendDeny("/vhost", res);
});

router.post("/resource", function (req, res) {
	const { resource, username } = req.body;
	// console.log("/resource", req.body, resource === 'queue' || resource === 'exchange' || /^user=.+/.test(username))
	if (resource === "queue" || resource === "exchange" || isUser(username)) return res.send("allow");

	sendDeny("/resource", res);
});

router.post("/topic", async function (req, res) {
	// console.log("/topic", req.body)
	const { vhost, username, name, permission, routing_key } = req.body;
	if (isUser(username)) return res.send("allow");

	if (isDevice(username) && name === "amq.topic" && vhost === "/") {
		// const { ownerId, topic } = await Device.getOwnerAndTopic(username);

		console.log("should check access to topic");
		return res.send("allow");
	}

	const matchedConf = routing_key.match(/^prefix\.([^\.]+)\.([^\.]+)\..+/);
	//console.log("matched", matchedConf);

	/* Allow only write */
	//console.log("cmp", matchedConf[2], username.replace("guest=", ""));
	if (matchedConf && matchedConf[1] === username.replace("guest=", "")) res.send("allow");
	else sendDeny("/topic " + routing_key + ", user=" + username, res);
});

export default router;
