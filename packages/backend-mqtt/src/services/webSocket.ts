import { DeviceModel } from "common/lib/models/deviceModel";
import { JwtService } from "common/lib/services/jwtService";
import { SocketThingState } from "common/lib/types";
import { Router } from "express";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import { Server as serverIO, Socket } from "socket.io";
import eventEmitter, { deviceSetState } from "./eventEmitter";

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
		}

		socket.join("public");

		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});

		socket.on("updateState", async (data: SocketThingState, fn: (json: Object) => void) => {
			const { _id, thing } = mongoSanitize.sanitize(data);
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
