import { JwtService } from "common/lib/services/jwtService";
import express from "express";
import mongoose from "mongoose";
import { Server as serverIO, Socket } from "socket.io";

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
	});

	return express.Router();
};
