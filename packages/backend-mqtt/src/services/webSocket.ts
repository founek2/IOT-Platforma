import { Router } from "express";
import { JwtService } from "common/lib/services/jwtService";
import Device from "backend/dist/models/Device";
import { includes } from "ramda";
import { CONTROL_TYPES } from "common/lib/constants";
import DeviceHandler, { handleMapping } from "common/lib/service/DeviceHandler";
import { Server as serverIO, Socket } from "socket.io";
import { UpdateThingState } from "../types";
import { DeviceModel } from "common/lib/models/deviceModel";
import mongoose from "mongoose";
import eventEmitter, { deviceSetState } from "./eventEmitter";
import { SocketThingState } from "common/lib/types";

const ObjectId = mongoose.Types.ObjectId;
type socketWithUser = {
	request: { user?: { id: string } };
} & Socket;

export default (io: serverIO) => {
	io.use((socket: socketWithUser, next) => {
		let token = socket.handshake.query.token as string;
		console.log("middleware loging io");
		JwtService.verify(token)
			.then((payload) => {
				socket.request.user = payload;
				next();
			})
			.catch(() => next());
	});

	io.on("connection", (socket: socketWithUser) => {
		console.log("New client connected", socket.request.user?.id || "unknown");
		if (socket.request.user) {
			console.log("user joined group");
			socket.join(socket.request.user.id);
			// const id = socket.request.user.id;
			// setTimeout(function () {
			// 	console.log(typeof id);
			// 	io.to(id).emit("control", "blabla");
			// }, 2000);
		}

		socket.join("public");

		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});

		socket.on("updateState", async ({ _id, thing }: SocketThingState, fn: (json: Object) => void) => {
			try {
				const doc = await DeviceModel.findOne(
					{
						_id: ObjectId(_id),
						"permissions.control": ObjectId(socket.request.user?.id),
					},
					{
						things: { $elemMatch: { _id: ObjectId(thing._id) } },
						metadata: 1,
					}
				).lean();
				if (!doc) return fn({ error: "invalidPermission" });
				fn({});
				// TODO validate all keys in state according to componentType
				console.log("looking for id", _id);
				eventEmitter.emit("device_set_state", {
					device: (doc as unknown) as deviceSetState["device"],
					state: thing.state,
				});
			} catch (err) {
				console.log("cant publish:");
				fn({ error: "error" });
			}
		});
	});

	return Router();
};
