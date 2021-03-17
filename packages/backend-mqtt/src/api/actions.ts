import express from "express";
import eventEmitter from "../service/eventEmitter";

const router = express.Router();

router.put("/device/:deviceId/pairing/init", function (req, res) {
	// console.log('/user', req.body);
	const deviceId = req.params.deviceId;
	const apiKey = req.body.apiKey;
	console.log("ACTIONS body", req.body);
	eventEmitter.emit("device_pairing_init", { deviceId, apiKey });
	res.sendStatus(204);
});

export default router;
